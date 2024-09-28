import { createRequire } from 'node:module'


// const electron = require("electron");
// const path = require("path");
import path from 'node:path';
import electron from 'electron';

const squirrel = createRequire(import.meta.url)('electron-squirrel-startup');


if (squirrel) {
  electron.app.quit();
}
const createWindow = () => {
  const mainWindow = new electron.BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });
  mainWindow.loadURL("http://localhost:5174");
  mainWindow.webContents.openDevTools();
};
electron.app.on("ready", createWindow);
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
