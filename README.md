# YouTube Music Desktop

A desktop wrapper for YouTube Music that allows you to use it independently of your web browser, with full media key support.

## Features

- 🎵 **Dedicated Desktop App**: Run YouTube Music as a standalone application
- ⌨️ **Media Key Support**: Use your keyboard's media keys to control playback
  - Play/Pause
  - Next Track
  - Previous Track
  - Volume Up/Down
- 💾 **Persistent Settings**: Window size and position are remembered
- 🔒 **Secure**: Built with security best practices
- 🎨 **Native Look**: Integrates seamlessly with your operating system

## Supported Media Keys

- **Play/Pause**: `MediaPlayPause`
- **Next Track**: `MediaNextTrack`
- **Previous Track**: `MediaPreviousTrack`
- **Volume Up**: `MediaVolumeUp` (falls back to `PageUp` if not supported)
- **Volume Down**: `MediaVolumeDown` (falls back to `PageDown` if not supported)

## Keyboard Shortcuts

- **Close Window**: `Ctrl+W` (or `Cmd+W` on macOS)
- **Force Quit App**: `Ctrl+Shift+Q` (or `Cmd+Shift+Q` on macOS)

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Development Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd ytmusic
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Convert the SVG icon to PNG:
   - Use an online converter or image editing software
   - Save as `assets/icon.png` (512x512 pixels recommended)

4. Start the development version:
   ```bash
   npm start
   ```

### Building for Distribution

#### Option 1: Simple Build (Recommended)
1. Build the application:
   ```bash
   npm run build-simple
   ```

2. Create installer packages:
   ```bash
   .\create-installer.ps1
   ```

This creates:
- `YouTube Music Desktop Portable.zip` - Portable version (extract and run)
- `YouTube Music Desktop Installer.zip` - Installer version (extract and run install.bat as admin)

#### Option 2: Advanced Build
1. Build the application:
   ```bash
   npm run build
   ```

2. Create distributable packages:
   ```bash
   npm run dist
   ```

The built applications will be available in the `dist` folder.

## Usage

1. Launch the application
2. Sign in to your YouTube Music account (if not already signed in)
3. Use your keyboard's media keys to control playback
4. The app will remember your window size and position

## Development

### Project Structure

```
ytmusic/
├── src/
│   ├── main.js          # Main Electron process
│   └── preload.js       # Preload script for security
├── assets/
│   ├── icon.svg         # App icon (SVG)
│   └── icon.png         # App icon (PNG)
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

### Key Components

- **main.js**: Handles the Electron app lifecycle, window management, and media key registration
- **preload.js**: Provides secure APIs for the renderer process
- **Media Key Integration**: Uses Electron's `globalShortcut` API to capture system media keys

### Media Key Implementation

The app uses JavaScript injection to interact with YouTube Music's web interface:

1. **Play/Pause**: Finds and clicks the play/pause button
2. **Track Navigation**: Clicks next/previous buttons
3. **Volume Control**: Manipulates the volume slider directly

### Security Features

- Context isolation enabled
- Node integration disabled
- Web security enabled
- Secure IPC communication
- External links opened in default browser

## Troubleshooting

### Media Keys Not Working

1. Ensure your keyboard has media keys
2. Check that no other application is capturing the media keys
3. Try restarting the application
4. On some systems, you may need to grant accessibility permissions

### App Won't Start

1. Check that Node.js is installed correctly
2. Verify all dependencies are installed: `npm install`
3. Check the console for error messages

### YouTube Music Not Loading

1. Check your internet connection
2. Ensure you can access music.youtube.com in your browser
3. Try refreshing the app (Ctrl+R or Cmd+R)

### App Won't Close

1. Use `Ctrl+W` to close the window
2. Use `Ctrl+Shift+Q` to force quit the app
3. The app is designed to always close properly, even when music is playing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [Electron](https://electronjs.org/)
- Icons and design inspired by YouTube Music
