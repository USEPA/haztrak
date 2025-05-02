/// <reference types="vitest" />
import * as path from 'path';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

const isTest = process.env.NODE_ENV === 'test';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 500,
  },
  plugins: [viteTsconfigPaths(), !isTest && reactRouter()],
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
        '**/*.config.*',
        '**/components/Charts/ManifestStatusPieChart/ManifestStatusPieChart.tsx',
      ],
    },
    globals: true,
    setupFiles: ['./src/mocks/setupTests.ts'],
  },
});
