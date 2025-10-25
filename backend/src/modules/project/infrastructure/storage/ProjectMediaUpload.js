import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";

const configureCloudinary = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary ortam değişkenleri tanımlı olmalıdır.");
  }

  cloudinary.v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  return cloudinary;
};

export const createProjectUpload = () => {
  const cloudinaryInstance = configureCloudinary();

  const storage = new CloudinaryStorage({
    cloudinary: cloudinaryInstance.v2,
    params: {
      folder: "portfolio/projects",
      format: async () => "jpeg",
      public_id: (_req, file) => `${file.originalname}-${Date.now()}`,
    },
  });

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Desteklenmeyen dosya tipi."));
      }
    },
  });
};

export default createProjectUpload;
