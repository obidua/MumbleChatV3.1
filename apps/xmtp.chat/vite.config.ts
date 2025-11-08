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
      registerType: "autoUpdate",
      injectRegister: null,
      includeAssets: ["favicon.svg", "apple-touch-icon.png", "icons/*.png"],
      manifest: {
        name: "MumbleChat - Decentralized Messaging",
        short_name: "MumbleChat",
        description:
          "Decentralized messaging on Ramestta with XMTP—secure, fast, and community owned.",
        start_url: "/",
        scope: "/",
        display: "fullscreen",
        display_override: ["fullscreen", "standalone", "minimal-ui"],
        orientation: "any",
        background_color: "#05060f",
        theme_color: "#0afff1",
        categories: ["social", "productivity", "communication"],
        lang: "en-US",
        screenshots: [
          {
            src: "/Screenshots/chat-screen.png",
            type: "image/png",
            sizes: "1170x2532",
            form_factor: "narrow",
            label: "Chat interface",
          },
          {
            src: "/Screenshots/contacts-screen.png",
            type: "image/png",
            sizes: "1170x2532",
            form_factor: "narrow",
            label: "Contacts list",
          },
        ],
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512x512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          {
            name: "New Chat",
            short_name: "New Chat",
            description: "Start a new direct message",
            url: "/conversations/new-dm",
            icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
          },
          {
            name: "New Group",
            short_name: "New Group",
            description: "Create a new group chat",
            url: "/conversations/new-group",
            icons: [{ src: "/icons/icon-192x192.png", sizes: "192x192" }],
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,wasm}"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MiB for WASM files
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
