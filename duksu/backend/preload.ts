import { clipboard, contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('WindowAPI', {
  windowShow: () => {
    ipcRenderer.send('window:show');
  },
  windowHide: () => {
    ipcRenderer.send('window:hide');
  },
  windowClose: () => {
    ipcRenderer.send('window:close');
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
});

contextBridge.exposeInMainWorld('ClipboardAPI', {
  copyToClipboard: (value: string) => clipboard.writeText(value)
});