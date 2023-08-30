/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    outDir: 'build',
    chunkSizeWarningLimit: 1000,
  },
  plugins: [react(), viteTsconfigPaths(), eslint()],
  server: {
    host: true,
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/setupTests.ts'],
  },
});
