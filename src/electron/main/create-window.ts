import { shell, BrowserWindow } from 'electron';
import { join } from 'node:path';
import { is } from '@electron-toolkit/utils';
import icon from '../../../resources/icon.png?asset';

export function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1800,
    height: 1080,
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
