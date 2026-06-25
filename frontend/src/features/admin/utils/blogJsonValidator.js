import { formatJson } from "./jsonHighlighter.js";

const VALID_STATUSES = ["draft", "published", "archived", "scheduled"];

export const validateBlogJson = (text) => {
  if (!text || !text.trim()) {
    return { valid: false, errors: ["JSON bos olamaz."] };
  }

  let data;
  try {
    data = JSON.parse(text.trim());
  } catch (e) {
    return { valid: false, errors: [`JSON parse hatasi: ${e.message}`] };
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { valid: false, errors: ["JSON bir obje olmali (array degil)."] };
  }

  const errors = [];

  if (!data.title || typeof data.title !== "string" || data.title.trim().length < 3) {
    errors.push("title: Zorunlu, en az 3 karakter olmali.");
  }

  if (!data.content || typeof data.content !== "string" || data.content.trim().length < 10) {
    errors.push("content: Zorunlu, en az 10 karakter olmali.");
  }

  if (data.tags !== undefined && data.tags !== null) {
    if (!Array.isArray(data.tags)) {
      errors.push("tags: Array olmali. Orn: [\"react\", \"web\"]");
    } else if (data.tags.some((t) => typeof t !== "string" || !t.trim())) {
      errors.push("tags: Tum elemanlar bos olmayan string olmali.");
    }
  }

  if (data.category !== undefined && data.category !== null && typeof data.category !== "string") {
    errors.push("category: String olmali.");
  }

  if (data.isPublished !== undefined && typeof data.isPublished !== "boolean") {
    errors.push("isPublished: true veya false olmali.");
  }

  if (data.status !== undefined && !VALID_STATUSES.includes(data.status)) {
    errors.push(`status: ${VALID_STATUSES.join(", ")} degerlerinden biri olmali.`);
  }

  if (data.thumbnailUrl !== undefined && data.thumbnailUrl !== null) {
    if (typeof data.thumbnailUrl !== "string") {
      errors.push("thumbnailUrl: String olmali.");
    } else if (data.thumbnailUrl && !/^https?:\/\//.test(data.thumbnailUrl)) {
      errors.push("thumbnailUrl: Gecerli bir URL olmali (http:// veya https:// ile baslamali).");
    }
  }

  if (data.excerpt !== undefined && data.excerpt !== null && typeof data.excerpt !== "string") {
    errors.push("excerpt: String olmali.");
  }

  if (data.featured !== undefined && typeof data.featured !== "boolean") {
    errors.push("featured: true veya false olmali.");
  }

  return {
    valid: errors.length === 0,
    errors,
    formatted: formatJson(text),
  };
};

export const BLOG_JSON_TEMPLATE = {
  title: "Blog Basligi",
  content: "# Markdown formatinda blog icerigi\n\nBuraya iceriginizi yazin...\n\n## Alt Baslik\n\nDetayli aciklama burada...",
  category: "teknoloji",
  tags: ["javascript", "react", "web"],
  isPublished: false,
  status: "draft",
  excerpt: "Blog yazisinin kisa ozeti (opsiyonel, max 300 karakter)",
  thumbnailUrl: "https://example.com/image.jpg",
  featured: false,
};

export const BLOG_JSON_TEMPLATE_INFO = [
  { label: "title", text: "Blog basligi (zorunlu, en az 3 karakter)" },
  { label: "content", text: "Icerik - Markdown formatinda (zorunlu, en az 10 karakter)" },
  { label: "category", text: "Kategori - herhangi bir string (opsiyonel, yoksa 'gelistirme')" },
  { label: "tags", text: "Etiketler dizisi (opsiyonel, orn: [\"react\", \"web\"])" },
  { label: "isPublished", text: "Yayinda mi? true/false (opsiyonel, varsayilan: false)" },
  { label: "status", text: "Durum: draft | published | archived | scheduled (opsiyonel)" },
  { label: "excerpt", text: "Kisa ozet - max 300 karakter (opsiyonel)" },
  { label: "thumbnailUrl", text: "Kapak gorseli URL'i (opsiyonel, https://...)" },
  { label: "featured", text: "One cikan mi? true/false (opsiyonel)" },
];
