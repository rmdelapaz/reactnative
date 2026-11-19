// Metro, the bundler, with two additions: expo-sqlite runs in the web preview as a WebAssembly
// file (.wasm), and Metro only bundles the file types it has been told about; and Zod's error
// messages in other languages stay out of the app (Lesson 8.4 measured them)
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('wasm');

// Zod 4 brings its messages in more than 40 languages, about 275 KB of the Android bundle.
// Shoreline Crew writes its own messages, so the list of languages is resolved to an empty module.
const zodLanguages = /[\\/]zod[\\/]v4[\\/]locales[\\/]index\.js$/;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolution = context.resolveRequest(context, moduleName, platform);
  if (resolution.type === 'sourceFile' && zodLanguages.test(resolution.filePath)) {
    return { type: 'empty' };
  }
  return resolution;
};

module.exports = config;
