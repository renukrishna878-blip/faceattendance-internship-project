import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { fork } from 'child_process';
import log from 'electron-log';
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
    mainWindow.loadURL('http://localhost:5173');
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
