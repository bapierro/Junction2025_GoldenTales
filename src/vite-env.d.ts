/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_ELEVENLABS_AGENT_ID?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
