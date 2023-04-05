const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const { Worker } = require('worker_threads');
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // nodeIntegration: true,
      //   contextIsolation: false,
    },
  });
  ipcMain.handle('ping', () => 'pong')
  win.loadFile('./renderer/index.html');
}
app.whenReady().then(() => {
  createWindow();

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

ipcMain.on('open-file-dialog', (event) => {
  console.log('open-file-dialog event received');
  dialog.showOpenDialog({
    properties: ['openFile']
  }).then(result => {
    if (!result.canceled && result.filePaths.length > 0) {
      event.sender.send('selected-file', result.filePaths[0]);
    }
  }).catch(err => {
    console.log(err);
  });
});

ipcMain.on('run-script', async (event, filePath) => {
    const workerPath = path.join(__dirname, 'worker.js');
    const worker = new Worker(workerPath);
  
    worker.postMessage(filePath);

    worker.on('message', () => {
      console.log('Message received from worker - finishing');
      event.reply('script-finished');
    });  
  
    worker.on('error', (err) => {
      console.error('Worker error:', err);
    });
  
    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      } 
    });
});

ipcMain.on('open-output-folder', (event) => {
  const outputFolderPath = path.join(__dirname, 'scripts', 'results');
  shell.openPath(outputFolderPath);
});