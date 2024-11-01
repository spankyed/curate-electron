import { spawn } from "node:child_process";
import path from "node:path";

function startElectronApp() {
  const electronPath = path.join(__dirname, 'node_modules', '.bin', 'electron');
  const appPath = path.join(__dirname, 'main.js'); // Adjust to your main process file

  const electronProcess = spawn(electronPath, [appPath]);

  electronProcess.stdout.on('data', (data) => {
    console.log(`Electron stdout: ${data}`);
  });

  electronProcess.stderr.on('data', (data) => {
    console.error(`Electron stderr: ${data}`);
  });

  electronProcess.on('close', (code) => {
    console.log(`Electron process exited with code ${code}`);
    // Decide whether to restart based on the exit code
    if (code !== 0) {
      console.log('Restarting Electron app...');
      startElectronApp();
    }
  });
}

startElectronApp();
