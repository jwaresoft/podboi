// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: ['./testSetup/testSetup.js'],
    globals: false, 
    coverage: {
      reporter: ["text"], 
      exclude: ['./testSetup', './src/lib/__fixtures__'],
    },
  },
});
