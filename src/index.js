const {app, BrowserWindow } = require('electron')

require('electron-reload')(__dirname, {
  electron: require('electron-prebuilt')
});

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ 
    x: 1920,
    y: 0,
    autoHideMenuBar: true
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  })
});