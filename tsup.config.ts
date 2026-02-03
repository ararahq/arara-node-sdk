import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],  // Main entry file
  format: ['cjs', 'esm'],   // Output both CommonJS and ES module formats
  dts: true,                // Generate TypeScript declaration files
  clean: true,              // Clean the dist folder before building
});
