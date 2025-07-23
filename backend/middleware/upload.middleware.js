import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";

//Cloudinary yapılandırması
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Multer: Cloudinary depolama ayarları
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "portfolio",
    format: async (req, file) => "jpeg",
    public_id: (req, file) => file.originalname + "-" + Date.now(),
  },
});

//Multer yapılandırması
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB dosya sınırı
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Desteklenmeyen dosya tipi! Sadece JPEG, PNG, GIF resimleri ve PDF dosyaları kabul edilir."
        ),
        false
      );
    }
  },
});

export { upload };
