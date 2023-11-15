import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugIn = {
  registerType: "prompt",
  includeAssests: ["favicon.ico", "logo256.png", "logo512.png"],
  manifest: {
    short_name: "Church System",
    name: "Church System",
    icons: [
      {
        src: "favicon.ico",
        sizes: "64x64 32x32 24x24 16x16",
        type: "image/x-icon",
      },
      {
        src: "logo256.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        src: "logo512.png",
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
