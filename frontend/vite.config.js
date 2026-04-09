/* eslint-env node */
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const API_PROXY_TARGET =
  process.env.VITE_API_PROXY_TARGET ?? "http://localhost:5000";

export default defineConfig({
  plugins: [react()],

  publicDir: path.resolve(rootDir, "public"),

  resolve: {
    alias: {
      "@app": path.resolve(rootDir, "src/app"),
      "@core": path.resolve(rootDir, "src/core"),
      "@modules": path.resolve(rootDir, "src/modules"),
      "@shared": path.resolve(rootDir, "src/shared"),
    },
  },

  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: {
          reactVendor: ["react", "react-dom", "react-router-dom"],
          animationVendor: ["gsap"],
          muiIcons: ["@mui/icons-material"],
        },
      },
    },
    chunkSizeWarningLimit: 1200,
  },

  server: {
    proxy: {
      // '/api' ile başlayan tüm istekleri, aşağıdaki hedefe yönlendir.
      "/api": {
        target: API_PROXY_TARGET, // Backend'in çalıştığı adres.
        changeOrigin: true, // Bu, CORS hatalarını önlemek için çok önemlidir.
        secure: false, // Backend'in https kullanmıyorsa.
      },
    },
  },
});
