import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt"],
      manifest: {
        name: "Taskly",
        short_name: "Taskly",
        description: "A task organizer",
        theme_color: "#ffffff",
        icons: [
          {
            src: "public/images/pwa-192x192.jpg",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "public/images/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "public/images/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
