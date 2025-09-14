import "@testing-library/jest-dom";
// Polyfill for TextEncoder/TextDecoder if missing
import { TextEncoder, TextDecoder } from "util";
if (typeof globalThis.TextEncoder === "undefined") {
  // @ts-ignore
  globalThis.TextEncoder = TextEncoder;
}
if (typeof globalThis.TextDecoder === "undefined") {
  // @ts-ignore
  globalThis.TextDecoder = TextDecoder;
}
