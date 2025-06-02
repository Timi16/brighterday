// ES6 version of our web-streams-polyfill shim
// This file handles the specific import path web-streams-polyfill/ponyfill/es6

class ReadableStream {
  constructor() {}
  getReader() {
    return {
      read: async () => ({ done: true, value: undefined }),
      releaseLock: () => {},
    };
  }
}

class WritableStream {
  constructor() {}
  getWriter() {
    return {
      write: async () => {},
      close: async () => {},
      abort: async () => {},
      releaseLock: () => {},
    };
  }
}

class TransformStream {
  constructor() {
    this.readable = new ReadableStream();
    this.writable = new WritableStream();
  }
}

// Export the minimal functionality needed
export {
  ReadableStream,
  WritableStream,
  TransformStream,
};

// Default export
export default {
  ReadableStream,
  WritableStream,
  TransformStream,
};
