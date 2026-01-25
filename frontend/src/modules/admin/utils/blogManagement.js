export const initialBlogFormState = {
  title: "",
  content: "",
  category: "",
  tags: "",
  isPublished: false,
};

export const blogCategories = [
  // Genel Kategoriler
  "geliştirme",
  "teknoloji",
  "tasarım",
  "eğitim",
  "kişisel",

  // Web Geliştirme
  "web",
  "frontend",
  "backend",
  "fullstack",

  // Programlama Dilleri
  "javascript",
  "typescript",
  "python",
  "java",
  "c#",
  "go",
  "rust",
  "php",

  // Framework & Kütüphaneler
  "react",
  "vue",
  "angular",
  "nodejs",
  "nextjs",
  "express",

  // Mobil & Platform
  "mobil geliştirme",
  "react native",
  "flutter",
  "ios",
  "android",

  // DevOps & Altyapı
  "devops",
  "docker",
  "kubernetes",
  "ci/cd",
  "linux",

  // Bulut Hizmetleri
  "bulut bilişim",
  "aws",
  "azure",
  "google cloud",

  // Veritabanı
  "veritabanı",
  "mongodb",
  "postgresql",
  "mysql",
  "redis",

  // Yapay Zeka & Veri
  "yapay zeka",
  "makine öğrenimi",
  "veri bilimi",
  "deep learning",

  // Güvenlik
  "siber güvenlik",
  "güvenlik",
  "penetrasyon testi",

  // Tasarım & UX
  "ui/ux",
  "web tasarım",
  "figma",
  "adobe xd",
  "accessibility",

  // Proje Yönetimi
  "proje yönetimi",
  "agile",
  "scrum",
  "kanban",

  // Test & Kalite
  "test",
  "test otomasyonu",
  "qa",

  // Performans & Optimizasyon
  "performans",
  "seo",
  "optimizasyon",

  // İş & Kariyer
  "kariyer",
  "girişimcilik",
  "startup",
  "iş yaşamı",
  "liderlik",

  // Kişisel Gelişim
  "kişisel gelişim",
  "verimlilik",
  "motivasyon",

  // İçerik & Pazarlama
  "içerik oluşturma",
  "dijital pazarlama",
  "sosyal medya",

  // Diğer
  "wordpress",
  "e-ticaret",
  "oyun geliştirme",
  "blockchain",
  "iot",
  "diğer",
];

export const toTagsText = (tags) => {
  if (!Array.isArray(tags)) {
    return "";
  }
  return tags.join(", ");
};

export const toTagsArray = (value) =>
  String(value ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

export const resolveBlogId = (blog) => blog?.id ?? blog?._id ?? "";

export const resolveThumbnailUrl = (blog) =>
  blog?.thumbnail?.url || blog?.thumbnailUrl || blog?.coverImage || "";

export const blogJsonTemplate = {
  title: "Blog Başlığı",
  content: "# Markdown formatında blog içeriği\n\nBuraya içeriğinizi yazın...",
  category: "teknoloji",
  tags: ["javascript", "react", "web"],
  thumbnailUrl: "https://example.com/image.jpg",
  isPublished: false,
};

export const blogJsonUploadTitle = "JSON ile Blog Yükle";

export const blogJsonUploadPlaceholder = "JSON verilerini buraya yapıştırın...";

export const blogJsonTemplateDescription =
  "Blog yazısı eklemek için aşağıdaki JSON formatını kullanın:";

export const blogJsonTemplateInfoItems = [
  { label: "title", text: "Blog başlığı (zorunlu)" },
  { label: "content", text: "Blog içeriği - Markdown formatında (zorunlu)" },
  { label: "category", text: "Kategori (opsiyonel)" },
  { label: "tags", text: "Etiketler dizisi (opsiyonel)" },
  { label: "thumbnailUrl", text: "Kapak görseli URL'i (opsiyonel)" },
  {
    label: "isPublished",
    text: "Yayın durumu - true veya false (opsiyonel)",
  },
];
