const { app, BrowserWindow } = require('electron')

require('electron-reload')(__dirname, {
  electron: require('electron-prebuilt')
});

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  })
});