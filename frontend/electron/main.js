import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { fork } from 'child_process';
import log from 'electron-log';
import fs from 'fs';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    show: false, 
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#ffffff'
  });

  if (process.env.NODE_ENV === 'development') {
    const loadDevURL = () => {
      mainWindow.loadURL('http://localhost:5173').catch(() => {
        setTimeout(loadDevURL, 1000);
      });
    };
    loadDevURL();
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  
  // Auto-updater Configuration
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';
  
  if (process.env.NODE_ENV !== 'development') {
    autoUpdater.checkForUpdatesAndNotify();
  }
}

function startBackend() {
  if (process.env.NODE_ENV === 'development') {
    log.info('Development mode: Backend running independently.');
    return;
  }
  
  // In production, the backend folder is copied to resourcesPath
  const backendPath = path.join(process.resourcesPath, 'backend', 'server.js');
  log.info(`Spawning Node Backend: ${backendPath}`);
  
  try {
    // Fork uses Electron's embedded Node.js runtime, which is perfect.
    backendProcess = fork(backendPath, [], {
      env: { ...process.env, PORT: 5000 },
      stdio: 'pipe'
    });
    
    backendProcess.stdout.on('data', (data) => log.info(`Backend: ${data}`));
    backendProcess.stderr.on('data', (data) => log.error(`Backend Err: ${data}`));
  } catch (err) {
    log.error('Failed to start backend', err);
  }
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Ensure backend dies when Electron dies
app.on('before-quit', () => {
  if (backendProcess) {
    log.info('Terminating backend process...');
    backendProcess.kill();
  }
});

// Native Print PDF handler
ipcMain.on('print-pdf', (event) => {
  if (mainWindow) {
    mainWindow.webContents.print({ silent: false, printBackground: true }, (success, failureReason) => {
      if (!success) log.error(`Failed to print PDF: ${failureReason}`);
    });
  }
});

// Native Save File Dialog handler
ipcMain.on('save-report', async (event, content, defaultFilename) => {
  if (!mainWindow) return;
  
  try {
    const { filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Attendance Report',
      defaultPath: path.join(app.getPath('downloads'), defaultFilename),
      filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    
    if (filePath) {
      fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
          log.error('Failed to write report file:', err);
          mainWindow.webContents.send('save-report-reply', false);
        } else {
          mainWindow.webContents.send('save-report-reply', true, path.basename(filePath));
        }
      });
    }
  } catch (err) {
    log.error('Error showing save dialog:', err);
    mainWindow.webContents.send('save-report-reply', false);
  }
});
