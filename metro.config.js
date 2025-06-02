const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);

// Enable CommonJS/ES modules interoperability
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs', 'mjs'];

// Ensure we properly bail on errors
config.maxWorkers = 1;
config.resetCache = true;

module.exports = config;
