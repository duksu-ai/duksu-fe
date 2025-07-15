import { Tray, Menu, nativeImage, app } from 'electron';
import path from 'path';
import { getPlatform } from './util';
import { BrowserWindow } from './window';
import config from './config';

let tray: Tray | null = null;

export function createTray(window: BrowserWindow): Tray {
  try {
    const iconPath = path.resolve(__dirname, '..', 'assets', 'tray-icon.png');
    const trayIcon = nativeImage.createFromPath(iconPath);
    tray = new Tray(trayIcon);
  } catch (error) {
    // Fallback to simple icon if icon file doesn't exist
    tray = new Tray(nativeImage.createEmpty());
  }

  tray.setToolTip(config.tray.tooltip);

  // Create context menu
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Duksu',
      click: () => {
        window.show();
        if (getPlatform() === 'macos' && app.dock) {
          app.dock.show();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);

  return tray;
}

export function destroyTray(): void {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}

export function getTray(): Tray | null {
  return tray;
}
