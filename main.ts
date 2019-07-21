import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as Jimp from 'jimp';

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

}

function autocropWithMargin(image, margin) {
  const backgroundColor = image.bitmap.data.readUInt32BE(0);
  const originalWidth = image.bitmap.width;
  const originalHeight = image.bitmap.height;

  // image = image.clone(); // uncomment this if you don't want original image to be modified
  image.autocrop();

  if (image.bitmap.width === originalWidth && image.bitmap.height === originalHeight) {
    return image;
  }

  const canvas = new Jimp(image.bitmap.width + margin * 2, image.bitmap.height + margin * 2, backgroundColor);

  // clear the area for the image
  canvas.scan(margin, margin, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    canvas.bitmap.data[idx + 3] = 0;
  });

  canvas.composite(image, margin, margin);
  return canvas;
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  ipcMain.on('crop-image', (event, arg) => {
    Jimp.read(arg.imagePath).then(image => {
      image = autocropWithMargin(image, 10);
      image.write(arg.outputPath);

      event.returnValue = arg.outputPath;
    });
  });

} catch (e) {
  // Catch Error
  // throw e;
}