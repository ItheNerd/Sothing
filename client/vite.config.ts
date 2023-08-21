import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import generateSitemap from "vite-plugin-pages-sitemap";
import Pages from "vite-plugin-pages";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    react(),
    Pages({
      onRoutesGenerated: (routes) => generateSitemap({ routes }),
    }),
  ],
});
