import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), svgr()],
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
