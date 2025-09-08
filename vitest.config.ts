/// <reference types="vitest" />
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    // Configuración del entorno de pruebas
    environment: "jsdom",

    // Configuración de archivos de setup
    setupFiles: ["./test/setup.ts"],

    // Configuración de alias para mocks
    alias: {
      "astro:db": new URL("./test/__mocks__/astro-db.mock.ts", import.meta.url)
        .pathname,
      "astro:actions": new URL(
        "./test/__mocks__/astro-actions.mock.ts",
        import.meta.url,
      ).pathname,
    },

    // Patrones de archivos de prueba
    include: ["test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],

    // Archivos a excluir
    exclude: [
      "node_modules",
      "dist",
      ".astro",
      "coverage",
      "**/*.d.ts",
      "db/**",
      "astro.config.mjs",
      "src/types/**",
      "src/env.d.ts",
      "src/actions/**",
      "src/components/icons/**",
      "test/__mocks__/**",
      "test/__templates__/**",
      "**/index.{js,ts,mjs,tsx,jsx}",
      "test/__templates__/**",
      "db/seed.ts",
      "**/sitemap.xml.ts",
    ],

    // Configuración de coverage
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/",
        "dist/",
        ".astro/",
        "coverage/",
        "**/*.d.ts",
        "**/*.config.{js,ts,mjs}",
        "**/test/**",
        "**/tests/**",
        "**/__tests__/**",
        "**/*.test.{js,ts,jsx,tsx}",
        "**/*.spec.{js,ts,jsx,tsx}",
        "src/env.d.ts",
        "src/types/**",
        "src/actions/**",
        "src/components/icons/**",
        "**/index.{js,ts,mjs,tsx,jsx}",
        "test/__mocks__/**",
        "test/__templates__/**",
        "astro.config.mjs",
        "db/seed.ts",
        "**/sitemap.xml.ts",
      ],
      include: ["src/**/*.{js,ts,jsx,tsx}", "!src/**/*.d.ts"],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },

    // Configuración de reporteros
    reporters: ["verbose", "html"],
    outputFile: {
      html: "./test-results/index.html",
    },

    // Configuración de timeout
    testTimeout: 10000,

    // Configuración de globals
    globals: true,

    // Configuración para React Testing Library
    env: {
      NODE_ENV: "test",
    },
  },
});
