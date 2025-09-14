import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    globals: true,
    coverage: {
      reporter: ["text", "html"],
      all: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/tests/**",
        "**/*.test.tsx",
        "**/*.test.ts",
      ],
    },
  },
});
