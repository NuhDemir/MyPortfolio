const dotenv = require('dotenv');
const connectDB = require('./config/db');   
const app = require('./app');

//Ortam değişkenlerini yükle
dotenv.config();

//veritabanı bağlantısını sağla
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,  ()=>{
    console.log(`Sunucu ${process.env.NODE_ENV} modunda ${PORT} portunda çalışıyor.`);
});


process.on('unhandledRejection',()=>{
    console.log('UNHANDLED REJECTION! Sunucu kapatılıyor...');
    console.log(err.name,err.message);
    server.close(()=>{
        process.exit(1);
    });
});
