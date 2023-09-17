// Plugins
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

// Utilities
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      styles: {
        configFile: "src/styles/settings.scss",
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Internal ISS Tools",
        short_name: "ISS Tools",
        description:
          "Collection of all the internal tools for the Icelandic Scooter Squad",
        theme_color: "#1867C0",
        background_color: "#0f126a",
        icons: [
          {
            src: "manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "manifest-icon-192.maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "manifest-icon-512.maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          {
            name: "Take Data",
            short_name: "Take Data",
            description: "Data collection Tool",
            url: "/take-data",
          },
          {
            name: "QR Codes",
            short_name: "QR Codes",
            description: "Edit QR codes",
            url: "/qr-codes",
          },
        ],
      },
    }),
  ],
  define: {
    /* prettier-ignore */
    "APP_VERSION": JSON.stringify(require("./package.json").version),
    "process.env": {},
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 3000,
  },
});
