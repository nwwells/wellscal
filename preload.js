const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateMessage: (callback) => ipcRenderer.on('update-message', (_event, value) => callback(value)),
});
