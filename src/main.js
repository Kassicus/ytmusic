const { app, BrowserWindow, globalShortcut, ipcMain, shell } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Initialize store for app settings
const store = new Store();

// Keep a global reference of the window object
let mainWindow;

// YouTube Music URL
const YOUTUBE_MUSIC_URL = 'https://music.youtube.com';

// App configuration
const APP_CONFIG = {
  width: store.get('window.width', 1200),
  height: store.get('window.height', 800),
  minWidth: 800,
  minHeight: 600,
  show: false, // Don't show until ready
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    webSecurity: true,
    preload: path.join(__dirname, 'preload.js')
  },
  icon: path.join(__dirname, '../assets/icon.png'),
  titleBarStyle: 'default',
  autoHideMenuBar: true
};

function createWindow() {
  console.log('Creating main window...');
  
  // Create the browser window
  mainWindow = new BrowserWindow(APP_CONFIG);

  // Load YouTube Music
  mainWindow.loadURL(YOUTUBE_MUSIC_URL);

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    console.log('Window ready to show');
    mainWindow.show();
    
    // Focus the window
    if (process.platform === 'darwin') {
      app.dock.show();
    }
  });

  // Handle window close attempt
  mainWindow.on('close', (event) => {
    console.log('Window close requested');
    
    // Force close the window regardless of web page state
    // This prevents YouTube Music from blocking the close
    mainWindow.destroy();
    event.preventDefault();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    console.log('Main window closed');
    mainWindow = null;
  });

  // Save window size on resize
  mainWindow.on('resize', () => {
    const [width, height] = mainWindow.getSize();
    store.set('window.width', width);
    store.set('window.height', height);
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Prevent YouTube Music from blocking window close
  mainWindow.webContents.on('will-prevent-unload', (event) => {
    console.log('YouTube Music tried to prevent unload, allowing anyway');
    event.preventDefault();
  });

  // Handle beforeunload events from the web page
  mainWindow.webContents.on('before-input-event', (event, input) => {
    // Allow Ctrl+W and Alt+F4 to close the window
    if ((input.control && input.key === 'w') || (input.alt && input.key === 'F4')) {
      mainWindow.destroy();
    }
  });

  // Register media key shortcuts
  registerMediaKeys();
  
  // Register keyboard shortcuts for app control
  registerKeyboardShortcuts();
}

function registerMediaKeys() {
  console.log('Registering media key shortcuts...');
  
  // Play/Pause
  globalShortcut.register('MediaPlayPause', () => {
    console.log('Media key: Play/Pause pressed');
    mainWindow.webContents.executeJavaScript(`
      (() => {
        const playButton = document.querySelector('.play-pause-button') || 
                          document.querySelector('[aria-label="Play"]') ||
                          document.querySelector('[aria-label="Pause"]');
        if (playButton) {
          playButton.click();
          return true;
        }
        return false;
      })()
    `).then(result => {
      if (!result) {
        console.log('Play/Pause button not found');
      }
    }).catch(error => {
      console.log('Error executing play/pause script:', error);
    });
  });

  // Next Track
  globalShortcut.register('MediaNextTrack', () => {
    console.log('Media key: Next Track pressed');
    mainWindow.webContents.executeJavaScript(`
      (() => {
        const nextButton = document.querySelector('.next-button') || 
                          document.querySelector('[aria-label="Next"]');
        if (nextButton) {
          nextButton.click();
          return true;
        }
        return false;
      })()
    `).then(result => {
      if (!result) {
        console.log('Next button not found');
      }
    }).catch(error => {
      console.log('Error executing next track script:', error);
    });
  });

  // Previous Track
  globalShortcut.register('MediaPreviousTrack', () => {
    console.log('Media key: Previous Track pressed');
    mainWindow.webContents.executeJavaScript(`
      (() => {
        const prevButton = document.querySelector('.previous-button') || 
                          document.querySelector('[aria-label="Previous"]');
        if (prevButton) {
          prevButton.click();
          return true;
        }
        return false;
      })()
    `).then(result => {
      if (!result) {
        console.log('Previous button not found');
      }
    }).catch(error => {
      console.log('Error executing previous track script:', error);
    });
  });

  // Volume Up - Using PageUp as fallback since MediaVolumeUp might not be supported
  try {
    globalShortcut.register('MediaVolumeUp', () => {
      console.log('Media key: Volume Up pressed');
      mainWindow.webContents.executeJavaScript(`
        (() => {
          const volumeSlider = document.querySelector('ytmusic-player-bar .volume-slider') ||
                              document.querySelector('input[aria-label*="volume" i]');
          if (volumeSlider) {
            const currentVolume = parseFloat(volumeSlider.value) || 0;
            const newVolume = Math.min(100, currentVolume + 10);
            volumeSlider.value = newVolume;
            volumeSlider.dispatchEvent(new Event('input', { bubbles: true }));
            return true;
          }
          return false;
        })()
      `).then(result => {
        if (!result) {
          console.log('Volume slider not found');
        }
      }).catch(error => {
        console.log('Error executing volume up script:', error);
      });
    });
  } catch (error) {
    console.log('MediaVolumeUp not supported, using PageUp as alternative');
    globalShortcut.register('PageUp', () => {
      console.log('PageUp key: Volume Up pressed');
      mainWindow.webContents.executeJavaScript(`
        (() => {
          const volumeSlider = document.querySelector('ytmusic-player-bar .volume-slider') ||
                              document.querySelector('input[aria-label*="volume" i]');
          if (volumeSlider) {
            const currentVolume = parseFloat(volumeSlider.value) || 0;
            const newVolume = Math.min(100, currentVolume + 10);
            volumeSlider.value = newVolume;
            volumeSlider.dispatchEvent(new Event('input', { bubbles: true }));
            return true;
          }
          return false;
        })()
      `).then(result => {
        if (!result) {
          console.log('Volume slider not found');
        }
      }).catch(error => {
        console.log('Error executing volume up script:', error);
      });
    });
  }

  // Volume Down - Using PageDown as fallback since MediaVolumeDown might not be supported
  try {
    globalShortcut.register('MediaVolumeDown', () => {
      console.log('Media key: Volume Down pressed');
      mainWindow.webContents.executeJavaScript(`
        (() => {
          const volumeSlider = document.querySelector('ytmusic-player-bar .volume-slider') ||
                              document.querySelector('input[aria-label*="volume" i]');
          if (volumeSlider) {
            const currentVolume = parseFloat(volumeSlider.value) || 0;
            const newVolume = Math.max(0, currentVolume - 10);
            volumeSlider.value = newVolume;
            volumeSlider.dispatchEvent(new Event('input', { bubbles: true }));
            return true;
          }
          return false;
        })()
      `).then(result => {
        if (!result) {
          console.log('Volume slider not found');
        }
      }).catch(error => {
        console.log('Error executing volume down script:', error);
      });
    });
  } catch (error) {
    console.log('MediaVolumeDown not supported, using PageDown as alternative');
    globalShortcut.register('PageDown', () => {
      console.log('PageDown key: Volume Down pressed');
      mainWindow.webContents.executeJavaScript(`
        (() => {
          const volumeSlider = document.querySelector('ytmusic-player-bar .volume-slider') ||
                              document.querySelector('input[aria-label*="volume" i]');
          if (volumeSlider) {
            const currentVolume = parseFloat(volumeSlider.value) || 0;
            const newVolume = Math.max(0, currentVolume - 10);
            volumeSlider.value = newVolume;
            volumeSlider.dispatchEvent(new Event('input', { bubbles: true }));
            return true;
          }
          return false;
        })()
      `).then(result => {
        if (!result) {
          console.log('Volume slider not found');
        }
      }).catch(error => {
        console.log('Error executing volume down script:', error);
      });
    });
  }
}

function registerKeyboardShortcuts() {
  console.log('Registering keyboard shortcuts...');
  
  // Force quit with Ctrl+Shift+Q
  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    console.log('Force quit shortcut pressed');
    app.quit();
  });
  
  // Close window with Ctrl+W
  globalShortcut.register('CommandOrControl+W', () => {
    console.log('Close window shortcut pressed');
    if (mainWindow) {
      mainWindow.destroy();
    }
  });
}

// App event handlers
app.whenReady().then(() => {
  console.log('App ready, creating window...');
  createWindow();

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  // Force quit the app regardless of platform
  // This ensures the app always closes properly
  app.quit();
});

app.on('will-quit', () => {
  console.log('App will quit, unregistering shortcuts...');
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
});

// Handle app activation (macOS)
app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show();
  }
});

// IPC handlers for communication with renderer
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-store-value', (event, key) => {
  return store.get(key);
});

ipcMain.handle('set-store-value', (event, key, value) => {
  store.set(key, value);
  return true;
}); 