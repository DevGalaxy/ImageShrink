const path = require('path')
const os = require('os')
const { app, BrowserWindow, Menu, globalShortcut, ipcMain, shell } = require('electron')
const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const slash = require('slash')

//Set env
process.env.NODE_ENV = 'production';

const isDev = process.env.NODE_ENV !== 'production' ? true : false

let mainWindow

function CreateMainWindow() {
    mainWindow = new BrowserWindow({
            title: 'Image Shrink',
            width: isDev ? 800 : 500,
            height: 600,
            icon: './assets/icons/icon.ico',
            resizable: isDev ? true : false,
            backgroundColor: "White",
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true,
            },
        })
        //mainWindow.loadURL(`file:///${__dirname}/app/index.html`);
    mainWindow.loadFile('./app/index.html')
}

app.on('ready', () => {
    CreateMainWindow()
    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)
    mainWindow.on('ready', () => mainWindow = null)
    globalShortcut.register("Ctrl+R", () => {
        mainWindow.reload()
    })
    globalShortcut.register("Ctrl+Shift+I", () => {
        mainWindow.toggleDevTools()
    })
})

const menu = [{
    role: 'fileMenu'
}]

ipcMain.on('image:minimize', (e, options) => {
    options.dest = path.join(os.homedir(), 'imageshrink')
    shrinkImage(options)
})
async function shrinkImage({ imgPath, quality, dest }) {
    try {
        const pngQulaity = quality / 100
        const files = await imagemin([slash(imgPath)], {
            destination: dest,
            plugins: [
                imageminMozjpeg({ quality }),
                imageminPngquant({
                    quality: [pngQulaity, pngQulaity]
                }),
            ],
        })

        shell.openPath(dest)
        mainWindow.webContents.send('image:done')
    } catch (err) {
        console.log(err)

    }
}