import { clipboard, contextBridge, ipcRenderer } from 'electron';

const ipcEvents = {
    window: {
        windowShow: () => {
            ipcRenderer.send('window:show');
        },
        windowHide: () => {
            ipcRenderer.send('window:hide');
        },
        windowMinimize: () => {
            ipcRenderer.send('window:minimize');
        },
        windowMaximize: () => {
            ipcRenderer.send('window:maximize');
        },
        windowUnmaximize: () => {
            ipcRenderer.send('window:unmaximize');
        },
        windowResize: (width: number, height: number) => {
            ipcRenderer.send('window:resize', width, height);
        }
    },
    clipboard: {
        copyToClipboard: (value: string) => {
            clipboard.writeText(value);
        }
    },
    auth: {
        onAuthCallback: (callback: (fragment: string) => void) => {
            ipcRenderer.on('auth:callback', (_, fragment) => callback(fragment));
        }
    },
    shell: {
        openExternal: (url: string) => {
            ipcRenderer.send('shell:openExternal', url);
        }
    }
}

contextBridge.exposeInMainWorld('WindowAPI', ipcEvents.window);
contextBridge.exposeInMainWorld('ClipboardAPI', ipcEvents.clipboard);
contextBridge.exposeInMainWorld('AuthAPI', ipcEvents.auth);
contextBridge.exposeInMainWorld('ShellAPI', ipcEvents.shell);

export type IpcEvents = typeof ipcEvents;