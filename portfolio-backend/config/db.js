const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB bağlantısı başarılı: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB bağlantısı başarısız: ${error.message}`);
        process.exit(1); // Bağlantı hatası durumunda uygulamayı kapat
    }
}

module.exports = connectDB;