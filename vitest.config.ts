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
        "**/main.tsx",
        "**/vite.config.ts",
        "**/src/types/**",
        "**/src/vite-env.d.ts",
        "**/src/index.tsx",
        "**/ApiService.ts",
        "**/redux/store.ts",
        "**/redux/combinedSlices.ts",
        "**/global.d.ts",
      ],
    },
  },
});
