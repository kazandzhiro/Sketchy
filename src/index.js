const { app, BrowserWindow } = require('electron');
const conf = new (require('electron-store'))();

// require('electron-reload')(__dirname, {
//   electron: require('electron-prebuilt')
// });

global.shared = {
  conf
}
let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 768,
    // x: 1920,
    // y: 0
  });

  // conf.set('imagesPath', 'C:\\Users\\Ivan_Kazandzhiev\\Desktop\\images')
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // const pathInput = document.getElementById('path');
  // pathInput.value = conf.imagePath || "Paste images path or...";

  // mainWindow.openDevTools();
  mainWindow.on('closed', () => {
    app.quit();
    mainWindow = null;
  });
});
