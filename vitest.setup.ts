import "@testing-library/jest-dom";
// Polyfill for TextEncoder/TextDecoder if missing
import { TextEncoder, TextDecoder } from "util";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(global as any).ResizeObserver = ResizeObserver;
if (typeof globalThis.TextEncoder === "undefined") {
  // @ts-ignore
  globalThis.TextEncoder = TextEncoder;
}
if (typeof globalThis.TextDecoder === "undefined") {
  // @ts-ignore
  globalThis.TextDecoder = TextDecoder;
}
