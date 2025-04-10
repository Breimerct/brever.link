interface ImportMetaEnv {
  readonly BASE_SHORT_URL: string;
  readonly ASTRO_DB_REMOTE_URL: string;
  readonly ASTRO_DB_APP_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
