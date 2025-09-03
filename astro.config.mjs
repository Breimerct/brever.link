// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import db from "@astrojs/db";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: "https://brever.link",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), db()],
  adapter: vercel({}),
});
