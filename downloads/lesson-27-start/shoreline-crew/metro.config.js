// Metro, the bundler, with one addition: expo-sqlite runs in the web preview as a WebAssembly
// file (.wasm), and Metro only bundles the file types it has been told about
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('wasm');

module.exports = config;
