// Main index file for web-streams-polyfill
// This handles the direct import path web-streams-polyfill

// Re-export from our ponyfill implementation
export * from './ponyfill/es6.js';
export { default } from './ponyfill/es6.js';
