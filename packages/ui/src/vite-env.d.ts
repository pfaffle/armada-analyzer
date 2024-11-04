/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_ENABLE_MOCKS: "1" | "0";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
