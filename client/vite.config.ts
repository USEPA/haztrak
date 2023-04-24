import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import eslint from 'vite-plugin-eslint';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [react(), viteTsconfigPaths(), eslint()],
  server: {
    host: true,
    port: 3000,
  },
});
