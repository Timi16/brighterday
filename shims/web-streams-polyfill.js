// This is a minimal shim for web-streams-polyfill to make Supabase work in React Native
// It provides just enough functionality to prevent errors

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
