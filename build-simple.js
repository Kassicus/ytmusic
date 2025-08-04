const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building YouTube Music Desktop App...');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Copy source files to dist
console.log('Copying source files...');
if (!fs.existsSync('dist/src')) {
  fs.mkdirSync('dist/src', { recursive: true });
}

// Copy main files
fs.copyFileSync('src/main.js', 'dist/src/main.js');
fs.copyFileSync('src/preload.js', 'dist/src/preload.js');

// Copy assets
if (!fs.existsSync('dist/assets')) {
  fs.mkdirSync('dist/assets', { recursive: true });
}

if (fs.existsSync('assets/icon.png')) {
  fs.copyFileSync('assets/icon.png', 'dist/assets/icon.png');
}

// Copy package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
// Remove build scripts and dev dependencies for production
delete packageJson.scripts;
delete packageJson.devDependencies;
packageJson.main = 'src/main.js';
fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 2));

// Install production dependencies
console.log('Installing production dependencies...');
execSync('npm install --production', { cwd: 'dist', stdio: 'inherit' });

// Install electron
console.log('Installing Electron...');
execSync('npm install electron@28.3.3', { cwd: 'dist', stdio: 'inherit' });

console.log('Build complete!');
console.log('To run the app: cd dist && npx electron .');
console.log('To distribute: zip the dist folder and share it'); 