const { app, BrowserWindow, Menu } = require("electron")
const path = require("path")

let mainWindow

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
    show: false,
    title: "Pandimus Reborn - Desktop RPG"
  })

  // Load the web app
  const isDev = process.env.NODE_ENV === "development"
  const isPlayerMode = process.argv.includes("--player")
  
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173")
    mainWindow.webContents.openDevTools()
  } else if (isPlayerMode) {
    // Load player-focused version
    console.log("Loading player mode...");
    mainWindow.loadFile("index-player.html")
  } else {
    // Load admin/development version
    mainWindow.loadFile("index.html")
  }

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    mainWindow.show()
    // Open developer tools for debugging
    if (isPlayerMode) {
      mainWindow.webContents.openDevTools()
    }
  })

  // Create menu
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "New Game",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            mainWindow.webContents.executeJavaScript("startNewGame()")
          }
        },
        {
          label: "Save Game",
          accelerator: "CmdOrCtrl+S",
          click: () => {
            mainWindow.webContents.executeJavaScript("alert('Save Game - Coming soon!')")
          }
        },
        { type: "separator" },
        {
          label: "Exit",
          accelerator: process.platform === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: "Game",
      submenu: [
        {
          label: "Debug Panel",
          accelerator: "F12",
          click: () => {
            mainWindow.webContents.executeJavaScript("showDebug()")
          }
        },
        {
          label: "Balance Dashboard",
          accelerator: "CmdOrCtrl+B",
          click: () => {
            mainWindow.webContents.executeJavaScript("showBalance()")
          }
        },
        {
          label: "Character Screen",
          accelerator: "CmdOrCtrl+C",
          click: () => {
            mainWindow.webContents.executeJavaScript("showCharacter()")
          }
        },
        {
          label: "Combat Arena",
          accelerator: "CmdOrCtrl+F",
          click: () => {
            mainWindow.webContents.executeJavaScript("showCombat()")
          }
        }
      ]
    },
    {
      label: "View",
      submenu: [
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click: () => {
            mainWindow.reload()
          }
        },
        {
          label: "Toggle Developer Tools",
          accelerator: process.platform === "darwin" ? "Alt+Cmd+I" : "Ctrl+Shift+I",
          click: () => {
            mainWindow.webContents.toggleDevTools()
          }
        },
        { type: "separator" },
        {
          label: "Full Screen",
          accelerator: "F11",
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen())
          }
        }
      ]
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About Pandimus Reborn",
          click: () => {
            console.log("About")
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow)

// Quit when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
