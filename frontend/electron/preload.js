const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  platform: process.platform,
  printPDF: () => ipcRenderer.send('print-pdf'),
  saveReport: (content, defaultFilename) => ipcRenderer.send('save-report', content, defaultFilename),
  onSaveReportReply: (callback) => {
    const subscription = (event, ...args) => callback(...args);
    ipcRenderer.on('save-report-reply', subscription);
    return () => ipcRenderer.removeListener('save-report-reply', subscription);
  }
});
