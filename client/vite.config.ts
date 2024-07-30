/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import viteTsconfigPaths from 'vite-tsconfig-paths';
// @ts-expect-error - we know package.json exists
import { dependencies } from './package.json';

function renderChunks(deps: Record<string, string>) {
  const chunks = {};
  Object.keys(deps).forEach((key) => {
    if (['react', 'react-router-dom', 'react-dom'].includes(key)) return;
    chunks[key] = [key];
  });
  return chunks;
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
  build: {
    sourcemap: true,
    outDir: 'build',
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-router-dom', 'react-dom'],
          ...renderChunks(dependencies),
        },
      },
    },
  },
  plugins: [react(), viteTsconfigPaths(), eslint()],
  server: {
    host: true,
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    sequence: {
      hooks: 'parallel',
    },
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/build/**',
        '**/dist/**',
        '**/coverage/**',
        '**/src/setupTests.ts',
        '**/src/reportWebVitals.ts',
        '**/public/**',
        '**/*.d.ts',
        '**/index.ts',
      ],
    },
    globals: true,
    setupFiles: ['src/setupTests.ts'],
  },
});
