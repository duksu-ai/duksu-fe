import path from "path";
import { BrowserWindow as ElectronBrowserWindow, ipcMain, Rectangle, screen } from "electron";
import { getPlatform } from "./util";
import config from "./config";

function calculateBounds(bounds: Rectangle, options: { width: number, height: number }): Rectangle {
    const display = screen.getPrimaryDisplay();
    const dimentions = { width: display.workAreaSize['width'], height: display.workAreaSize['height'] };

    const calcX = Math.round(bounds.x - (dimentions.width - bounds.width) / 2)
    const calcY = Math.round(bounds.y - (dimentions.height - bounds.height) / 2)
    const x = calcX > 0 ? calcX : 0
    const y = calcY > 0 ? calcY : 0
    return { x, y, width: dimentions.width, height: dimentions.height }
}

class BrowserWindow extends ElectronBrowserWindow {
  resize(width: number, height: number) {
    const currentBounds = this.getBounds();
    const newBounds = calculateBounds(currentBounds, { width, height });
    this.setBounds(newBounds, true);
  }
}

const window = new BrowserWindow({
  width: config.window.defaultWidth,
  height: config.window.defaultHeight,
  minWidth: config.window.minWidth,
  minHeight: config.window.minHeight,
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    preload: path.resolve(__dirname, 'preload.js'),
  },
  titleBarStyle: getPlatform() === 'macos' ? 'hiddenInset' : 'default',
  frame: getPlatform() !== 'windows',
});

window.loadFile(path.resolve(__dirname, '..', '..', 'renderer', 'index.html'));

if (process.argv.includes('--dev')) {
  window.webContents.openDevTools();
}

window.once('ready-to-show', () => {
  window.show();
});

window.on('close', () => {
  if (getPlatform() !== 'macos') {
    window.hide();
  } else {
    window.close();
  }
});

export default window;

/**
 * IPC Events
 */
ipcMain.on('window:show', () => {
  window.show();
});

ipcMain.on('window:hide', () => {
  window.hide();
});

ipcMain.on('window:close', () => {
  window.close();
});

ipcMain.on('window:minimize', () => {
  window.minimize();
});

ipcMain.on('window:maximize', () => {
  window.maximize();
});

ipcMain.on('window:unmaximize', () => {
  window.unmaximize();
});

ipcMain.on('window:resize', (_, width: number, height: number) => {
  window.resize(width, height);
});