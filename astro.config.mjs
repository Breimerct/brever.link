// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import db from "@astrojs/db";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  output: "server",

  vite: {
    plugins: [tailwindcss()],
  },

  experimental: {
    svg: true,
  },

  integrations: [react(), db()],
  adapter: netlify({}),
});
