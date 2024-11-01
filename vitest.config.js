// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: ['./testSetup/testSetup.js'],
    globals: false, 
    coverage: {
      reporter: ["text"], 
      exclude: ['**/*.js', '!src/**/*.js', 'src/lib/__fixtures__/**/*.js', './src/lib/callFetch/callFetch.js'],
    },
  },
});
