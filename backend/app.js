// backend/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url"; // ES Modules için

// Middleware'ler
import { notFound, errorHandler } from "./middleware/error.middleware.js";
// Rotalar
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js"; // Proje rotaları
import blogRoutes from "./routes/blog.routes.js"; // Blog rotaları // CV yükleme/indirme rotaları
// Mesaj/yorum rotaları

const app = express();

// ES Modules için __dirname ve __filename simülasyonu
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Güvenlik & Ortak Middleware'ler ---

// CORS Ayarları: Frontend uygulamanızın URL'sine izin verin.
// Geliştirme ve canlı ortamlar için ayrı ayrı tanımlamak en iyisidir.
const allowedOrigins = [
  "http://localhost:5173", // Frontend'in Vite geliştirme adresi (önemli!)
  "http://localhost:3000", // Frontend'in başka bir geliştirme adresi olabilir
  // 'https://www.yourportfolio.com', // Canlı frontend domain'i
  // 'https://your-custom-domain.com', // Eğer varsa başka bir canlı domain
];

app.use(
  cors({
    origin: (origin, callback) => {
      // İstek bir tarayıcıdan gelmiyorsa (örn. Postman, curl) veya origin izin verilenler listesindeyse
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(
          new Error("CORS politikası tarafından bu kaynağa izin verilmiyor.")
        );
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // JWT token'ları için Authorization header'ı
    credentials: true, // Çerezlerin (cookies) ve yetkilendirme başlıklarının gönderilmesine izin verir
  })
);

// Helmet: Çeşitli HTTP başlıkları ayarlayarak uygulamayı korur.
app.use(helmet());

// Express Rate Limit: DDoS ve brute-force saldırılarına karşı istek hızını sınırlar.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // Her IP için 15 dakikada maksimum 100 istek
  message: "Çok fazla istek gönderdiniz, lütfen bir süre sonra tekrar deneyin.",
  standardHeaders: true, // 'RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset' başlıklarını ekler
  legacyHeaders: false, // X-RateLimit-* başlıklarını devre dışı bırakır
});
app.use(limiter);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blog", blogRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.resolve(__dirname, "..", "..", "frontend", "dist");

  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running in development mode...");
  });
}

app.use(notFound);

app.use(errorHandler);

export default app;
