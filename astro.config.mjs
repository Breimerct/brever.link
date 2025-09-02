// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import db from "@astrojs/db";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: "https://brever.link",

  vite: {
    plugins: [tailwindcss()],
  },

  redirects: {},

  integrations: [react(), db()],
  adapter: cloudflare(),
});
