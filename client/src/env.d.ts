/// <reference types="vite/client" />

// see Vite's documentation on environment variables
// https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript

interface ImportMetaEnv {
  readonly VITE_HT_API_URL: string;
  readonly VITE_GITHUB_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
