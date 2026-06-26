/// <reference types="vite/client" />

interface ImportMetaEnv {
  // URL publique du backend (vide en dev → on utilise le proxy Vite).
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
