import * as path from 'path';
/// <reference types="vitest" />
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { dependencies } from './package.json';

function renderChunks(deps: Record<string, string>) {
  const chunks = {};
  Object.keys(deps).forEach((key) => {
    if (['react', 'react-router', 'react-dom'].includes(key)) return;
    // @ts-expect-error - error with vite-plugin-eslint
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
          vendor: ['react', 'react-router', 'react-dom'],
          ...renderChunks(dependencies),
        },
      },
    },
  },
  plugins: [viteTsconfigPaths(), reactRouter()],
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
        '**/app/setupTests.ts',
        '**/app/reportWebVitals.ts',
        '**/public/**',
        '**/*.d.ts',
        '**/index.ts',
        '**/*.config.*',
        '**/components/Charts/ManifestStatusPieChart/ManifestStatusPieChart.tsx',
      ],
    },
    globals: true,
    setupFiles: ['./app/mocks/setupTests.ts'],
  },
});
