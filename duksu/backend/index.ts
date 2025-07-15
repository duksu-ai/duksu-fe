import { app, ipcMain, shell } from "electron";
import { autoUpdater } from 'electron-updater';
import { getPlatform } from './util';
import createWindow, { BrowserWindow } from './window';
import { createTray, destroyTray } from './tray';
import config from "./config";

let window: BrowserWindow | null = null;

const instanceLock = app.requestSingleInstanceLock();
if (!instanceLock) {
  app.quit()
} else {
  app.whenReady().then(() => {
    window = createWindow();
    createTray(window);
    window.show();
    
    // Check for updates after window is ready
    setTimeout(() => {
      if (config.autoUpdate.enabled) {
        autoUpdater.allowPrerelease = config.autoUpdate.allowPrerelease;
        autoUpdater.checkForUpdatesAndNotify();
      }
    }, 3000);
  });
  app.on('second-instance', () => {
    window?.show();
  });
  app.on('activate', () => {
    window?.show();
  });
}

// On macOS, keep the app running even when all windows are closed
app.on('window-all-closed', () => {
  if (getPlatform() !== 'macos') {
    app.quit();
  }
});

// Clean up tray when app is quitting
app.on('before-quit', () => {
  destroyTray();
});

// Security: Prevent new window creation
app.on('web-contents-created', (_, contents) => {
  contents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });
});

/**
 * Ipc Events
 */
ipcMain.on('shell:openExternal', (_, url: string) => {
  shell.openExternal(url);
});