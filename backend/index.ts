import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "node:path";
import { prepareNext } from "sc-prepare-next";
import { actions, CHANNELS } from "./actions";
import { PORT } from "./constants";
import { sequelize } from "./database";

/**
 * Creates the main application window.
 *
 * The window is created with the following options:
 *
 * - `width`: 900
 * - `height`: 700
 * - `webPreferences`:
 *   - `nodeIntegration`: false
 *   - `contextIsolation`: true
 *   - `preload`: the path to the preload script
 *
 * If the application is running in development mode, the window is loaded with
 * the URL "http://localhost:4444/", and the devtools are opened. The window is
 * also maximized.
 *
 * If the application is running in production mode, the window is loaded with
 * the path to the main application HTML file, and the menu is set to null.
 */
function createWindow(): void {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, "preload.js"),
    },
  });

  if (app.isPackaged) {
    win.loadFile(join(__dirname, "..", "..", "dist", "frontend", "index.html"));
    win.setMenu(null);
  } else {
    win.loadURL(`http://localhost:${PORT}/`);
    win.webContents.openDevTools();
  }
}

/**
 * When the application is ready, this function is called.
 *
 * It creates a BrowserWindow instance and loads the main application.
 * It also sets up the logging and database connections.
 *
 * @returns {Promise<void>} A Promise that resolves when all the setup is done.
 */
app.whenReady().then(async () => {
  await prepareNext("./src", PORT);

  await sequelize
    .sync({
      logging: true,
      alter: true,
      // this is used for development.
      // If you want to reset the database, set this to true and run the script again.
      // Otherwise, set it to false.
      force: false,
    })
    .then(() => {
      console.log("Database synced");
    });

  // await db.$client
  //   .sync()
  //   .then((a) => console.log("Drizzle database synced", a));

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

/* ++++++++++ events ++++++++++ */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

/* ++++++++++ code ++++++++++ */
/* Initialize IPC communication channels */
for (const channel of CHANNELS) {
  ipcMain.handle(
    channel,
    async (_, ...args) =>
      await (actions[channel] as (...args: unknown[]) => unknown)(...args)
  );
}
