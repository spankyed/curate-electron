import { app } from 'electron';
import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import path from 'node:path';
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

export function startChromaDB() {
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
  chromaProc = spawn(chromaPath, args);
  // chromaProc = spawn(chromaPath, args, { env });

  chromaProc.stdout.on('data', (data) => {
    console.log(`ChromaDB stdout: ${data}`);
  });

  chromaProc.stderr.on('data', (data) => {
    console.error(`ChromaDB stderr: ${data}`);
  });

  chromaProc.on('close', (code) => {
    console.log(`ChromaDB process exited with code ${code}`);
  });

  return chromaProc;
}

// Manually kill the chroma process
app.on('before-quit', () => {
  if (chromaProc) {
    // console.log('chromaProc: ', chromaProc);
    chromaProc.kill();
  }
});
