import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugIn = {
  registerType: "prompt",
  includeAssests: ["favicon.ico", "logo.png", "log.png"],
  manifest: {
    short_name: "Worship Sys",
    name: "Worship Sys",
    icons: [
      {
        src: "favicon.ico",
        sizes: "64x64 32x32 24x24 16x16",
        type: "image/x-icon",
      },
      {
        src: "logo.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        src: "logo.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    start_url: "/",
    scope: "/",
    display: "standalone",
    theme_color: "#000000",
    background_color: "#ffffff",
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn)],
});
