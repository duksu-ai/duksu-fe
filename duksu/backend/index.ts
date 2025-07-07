import { app } from "electron";
import { getPlatform } from './util';
import createWindow, { BrowserWindow } from './window';

let window: BrowserWindow | null = null;
const instanceLock = app.requestSingleInstanceLock();
if (!instanceLock) {
  app.quit()
} else {
  app.whenReady().then(() => {
    window = createWindow();
    window.show();
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

// Security: Prevent new window creation
app.on('web-contents-created', (_, contents) => {
  contents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });
});