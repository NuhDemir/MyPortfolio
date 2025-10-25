import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [
    react({
      // SVG dosyalarını ReactComponent olarak işlemek için
      include: [/\.svg$/],
    }),
  ],

  resolve: {
    alias: {
      "@app": path.resolve(rootDir, "src/app"),
      "@core": path.resolve(rootDir, "src/core"),
      "@modules": path.resolve(rootDir, "src/modules"),
      "@shared": path.resolve(rootDir, "src/shared"),
    },
  },

  build: {
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
        target: "http://localhost:5000", // Backend'in çalıştığı adres.
        changeOrigin: true, // Bu, CORS hatalarını önlemek için çok önemlidir.
        secure: false, // Backend'in https kullanmıyorsa.
      },
    },
  },
});
