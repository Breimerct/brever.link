/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly BASE_SHORT_URL: string;
  readonly ASTRO_DB_REMOTE_URL: string;
  readonly ASTRO_DB_APP_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type EdgeLocals = import("@astrojs/vercel").EdgeLocals;

declare namespace App {
  interface Locals extends EdgeLocals {}
}
