/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DOWNLOAD_DISPATCH_TOKEN?: string;
  readonly VITE_DOWNLOAD_DISPATCH_REPO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
