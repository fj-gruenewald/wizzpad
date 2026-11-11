import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";
import pkg from "./package.json" with { type: "json" };

export default defineConfig({
  base: "./",
  define: { __VERSION__: JSON.stringify(pkg.version) },
  plugins: [
    svelte(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg", "icon-192.png", "icon-512.png", "icon-maskable-512.png"],
      manifest: {
        name: "Wizzpad",
        short_name: "Wizzpad",
        description: "Punkteblock für Wizard – ohne Werbung, offline",
        lang: "de",
        theme_color: "#fff8f5",
        background_color: "#fff8f5",
        display: "fullscreen",
        display_override: ["fullscreen", "standalone"],
        orientation: "any",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          { src: "icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
        ],
      },
      workbox: { globPatterns: ["**/*.{js,css,html,svg,json}"], maximumFileSizeToCacheInBytes: 4_000_000 },
    }),
  ],
  server: { port: 5173, strictPort: true, allowedHosts: true },
  test: { environment: "node" },
});
