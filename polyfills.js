// Essential polyfills for React Native compatibility with Supabase
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';

// Global variable setup for React Native compatibility
global.Buffer = require('buffer').Buffer;
global.process = require('process');

// The line below fixes the "_reactNativePolyfillGlobals.polyfillGlobal is not a function" error
if (!global.polyfillGlobal) {
  global.polyfillGlobal = function(name, value) {
    if (!global[name]) global[name] = value;
  };
}

// For web-streams-polyfill compatibility
global.ReadableStream = global.ReadableStream || function() {};
global.WritableStream = global.WritableStream || function() {};
global.TransformStream = global.TransformStream || function() {};
