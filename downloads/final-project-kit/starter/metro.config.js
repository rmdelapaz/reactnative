// Metro, the bundler, with one addition from Lesson 8.4: Zod 4 brings its messages in more than
// 40 languages (about 275 KB of an Android bundle). The app writes its own messages, so the list of
// languages is resolved to an empty module.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const zodLanguages = /[\\/]zod[\\/]v4[\\/]locales[\\/]index\.js$/;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolution = context.resolveRequest(context, moduleName, platform);
  if (resolution.type === 'sourceFile' && zodLanguages.test(resolution.filePath)) {
    return { type: 'empty' };
  }
  return resolution;
};

module.exports = config;
