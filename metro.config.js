const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts = [...defaultConfig.resolver.sourceExts, 'mjs'];

const config = mergeConfig(defaultConfig, {});

module.exports = withNativeWind(config, { input: './global.css' });