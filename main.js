const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const path = require('path');

// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile('index.html');

  return win;
}

app.whenReady().then(() => {
  const win = createWindow();

  // Check for updates immediately on startup
  // In a real app, you might want to do this less frequently or on user request
  autoUpdater.checkForUpdatesAndNotify();

  // Send update status to renderer
  autoUpdater.on('checking-for-update', () => {
    win.webContents.send('update-message', 'Checking for update...');
  });
  autoUpdater.on('update-available', (info) => {
    win.webContents.send('update-message', 'Update available.');
  });
  autoUpdater.on('update-not-available', (info) => {
    win.webContents.send('update-message', 'Update not available.');
  });
  autoUpdater.on('error', (err) => {
    win.webContents.send('update-message', 'Error in auto-updater. ' + err);
  });
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    win.webContents.send('update-message', log_message);
  });
  autoUpdater.on('update-downloaded', (info) => {
    win.webContents.send('update-message', 'Update downloaded');
  });

  ipcMain.handle('app_version', () => {
    return { version: app.getVersion() };
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
