import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    VitePWA({
      registerType: "prompt",
      injectRegister: "auto",
      includeAssets: ["favicon.svg", "apple-touch-icon.png", "icons/*.png"],
      manifest: false, // Use external manifest file
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.ipfs\..*\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "ipfs-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["@xmtp/wasm-bindings"],
  },
  server: {
    port: 5189, // 👈 set your custom port here
    open: true, // optional: auto-open browser
  },
});
