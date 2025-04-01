import { app } from 'electron';
import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import path from 'node:path';
import * as sharedRepository from '@services/core/repository';

// import { is } from '@electron-toolkit/utils';

// if (is.dev) {
// }

let chromaProc: ChildProcessWithoutNullStreams | null = null;

function getResourcePath(...paths) {
  // const isDev = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    // In development, resources are relative to the project directory
    return path.join(__dirname, '..', '..', ...paths);
  }

  // In production, resources are in the app's resources directory
  return path.join(process.resourcesPath, ...paths);
}

function getDatabasePath() {
  const inDevelopment = !app.isPackaged;

  if (inDevelopment) {
    // Development: use the project directory
    return path.join(__dirname, '../../src/services/database/chroma');
  }

  // Production: use the app's user data directory
  return path.join(app.getPath('userData'), 'chromadb');
}

async function waitForChromaDBReady(timeout = 30000, interval = 500) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    try {
      // Attempt to connect to ChromaDB
      // await axios.get('http://localhost:8000/'); // ! may need to adjust the URL in prod
      await sharedRepository.chroma.chromaHeartbeat();

      return;
    } catch (error) {
      // ChromaDB is not ready yet
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
  throw new Error('ChromaDB did not become ready within the specified timeout');
}

export async function startChromaDB() {
  const chromaExecutable = process.platform === 'win32' ? 'chroma.exe' : 'chroma';
  const venvDir = getResourcePath('lib', 'chroma', 'venv');
  const chromaPath =
    process.platform === 'win32'
      ? path.join(venvDir, 'Scripts', chromaExecutable)
      : path.join(venvDir, 'bin', chromaExecutable);

  // Define the path to your database
  const dbPath = getDatabasePath();
  const args = ['run', '--path', dbPath];
  // Environment variables for the Python process
  // const env = {
  //   ...process.env,
  //   PYTHONHOME: venvDir, // Helps Python find its libraries
  // };

  console.log('paths: ', { resourcesPath: process.resourcesPath, chromaPath, dbPath });

  // Start the ChromaDB process
  // ? chroma run --host localhost --port 8000 --path ./my_chroma_data
  // ? http://localhost:8000/docs
  chromaProc = spawn(chromaPath, args);
  // chromaProc = spawn(chromaPath, args, { env });

  chromaProc.stdout.on('data', (data) => {
    // console.log(`[ChromaDB stdout] ${data}`);
  });

  chromaProc.stderr.on('data', (data) => {
    // console.error(`[ChromaDB stderr] ${data}`);
  });

  chromaProc.on('close', (code) => {
    // console.log(`ChromaDB process exited with code ${code}`);
  });

  waitForChromaDBReady()
    .then(() => {
      console.log('\x1b[32m%s\x1b[0m', 'ChromaDB is ready');
      sharedRepository.chroma.initializeReferenceCollection();
    })
    .catch((error) => {
      console.error('Error waiting for ChromaDB:', error);
    });

  return chromaProc;
}

export function cleanupResources() {
  console.log('Closing chroma server...');
  if (chromaProc) {
    try {
      chromaProc.kill();
      console.log('ChromaDB process terminated');
    } catch (error) {
      console.log('Error terminating ChromaDB process:', error);
    }
  }
}

// Manually kill the chroma process
app.on('before-quit', () => {
  cleanupResources();
});
