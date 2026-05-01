import '@testing-library/jest-dom';

// jsdom doesn't implement IntersectionObserver — FadeUp uses it.
// Stub a minimal version so components mount without throwing in tests.
if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  }
  window.IntersectionObserver = IO;
  global.IntersectionObserver = IO;
}
