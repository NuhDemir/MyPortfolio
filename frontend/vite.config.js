import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      // SVG dosyalarını ReactComponent olarak işlemek için
      include: [/\.svg$/],
    }),
  ],
  resolve: {
    alias: {
      "@assets": "/src/assets", // src/assets için bir alias (opsiyonel)
    },
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
