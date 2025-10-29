import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  optimizeDeps: {
    exclude: ["@xmtp/wasm-bindings"],
  },
  server: {
    port: 5189, // 👈 set your custom port here
    open: true, // optional: auto-open browser
  },
});
