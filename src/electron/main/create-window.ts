import { shell, BrowserWindow } from 'electron';
import { join } from 'node:path';
import { is } from '@electron-toolkit/utils';
import icon from '../resources/icon.png?asset';

export function createWindow(): void {
  // const factor = screen.getPrimaryDisplay().scaleFactor;

  // const primaryDisplay = screen.getPrimaryDisplay();
  // const { width, height } = primaryDisplay.workAreaSize;

  const mainWindow = new BrowserWindow({
    // width: 1024 / factor,
    // height: 768 / factor,
    // width: 1900,
    // height: 1100,
    width: 1500,
    height: 900,
    minWidth: 1500,
    minHeight: 900,
    show: false,
    title: 'CurateGPT',
    // transparent: true,
    // autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 20, y: 20 },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

export function sendToMainWindow(event, data) {
  return BrowserWindow.getAllWindows()[0]?.webContents.send(event, data);
}
