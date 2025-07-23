import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

// ES Modules için __dirname ve __filename emülasyonu
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

// Veritabanı bağlantısını kur ve durumunu kontrol et
connectDB()
  .then(() => {
    // Veritabanı bağlantısı başarılı olursa sunucuyu başlat
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`
      );
    });
  })
  .catch((error) => {
    // Veritabanı bağlantısı başarısız olursa hata mesajını göster ve uygulamayı kapat
    console.error(
      `\x1b[31mError:\x1b[0m Could not connect to the database. ${error.message}`
    );
    process.exit(1);
  });
