import { app } from "electron";
import { getPlatform } from "./util";
import window from "./window";

const instanceLock = app.requestSingleInstanceLock();
if (!instanceLock) {
  app.quit()
} else {
  app.whenReady().then(() => {
    window.show();
  });
  app.on('second-instance', () => {
    window.show();
  });
  app.on('activate', () => {
    window.show();
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