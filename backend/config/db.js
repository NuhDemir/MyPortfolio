// backend/config/db.js
import mongoose from "mongoose"; // MongoDB ile konuşmamızı sağlayan kütüphane

// MongoDB'ye bağlanma fonksiyonu
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // Bağlantı başarılıysa, yeşil renkli mesajı konsola yazdır
    console.log(`\x1b[32mMongoDB Connected:\x1b[0m ${conn.connection.host}`); // Yeşil renk için ANSI escape kodu
  } catch (error) {
    // Bağlantı başarısızsa, kırmızı renkli hata mesajını konsola yazdır ve uygulamayı kapat
    console.error(`\x1b[31mError:\x1b[0m ${error.message}`); // Kırmızı renk için ANSI escape kodu
    process.exit(1); // Veritabanı bağlantısı başarısız olursa uygulamayı kapat
  }
};

export default connectDB; // Bu fonksiyonu diğer dosyalarda kullanabilmek için dışa aktar
