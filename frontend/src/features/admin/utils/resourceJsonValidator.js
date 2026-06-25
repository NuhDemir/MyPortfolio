import { formatJson } from "./jsonHighlighter.js";

const VALID_TYPES = ["kitap", "video", "makale", "kurs", "arac", "diger"];
const VALID_DIFFICULTIES = ["baslangic", "orta", "ileri", "uzman"];
const VALID_LANGUAGES = ["tr", "en", "de", "fr", "es"];

export const validateResourceJson = (text) => {
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

  if (!data.title || typeof data.title !== "string" || data.title.trim().length < 2) {
    errors.push("title: Zorunlu, en az 2 karakter olmali.");
  }

  if (!data.url || typeof data.url !== "string" || !/^https?:\/\//.test(data.url)) {
    errors.push("url: Zorunlu, gecerli bir URL olmali (http:// veya https://).");
  }

  if (data.type && !VALID_TYPES.includes(data.type)) {
    errors.push(`type: ${VALID_TYPES.join(", ")} degerlerinden biri olmali.`);
  }

  if (data.tags !== undefined && data.tags !== null) {
    if (!Array.isArray(data.tags)) {
      errors.push("tags: Array olmali. Orn: [\"react\", \"frontend\"]");
    } else if (data.tags.some((t) => typeof t !== "string" || !t.trim())) {
      errors.push("tags: Tum elemanlar bos olmayan string olmali.");
    }
  }

  if (data.description !== undefined && data.description !== null && typeof data.description !== "string") {
    errors.push("description: String olmali.");
  }

  if (data.author !== undefined && data.author !== null && typeof data.author !== "string") {
    errors.push("author: String olmali.");
  }

  if (data.rating !== undefined && data.rating !== null) {
    const r = Number(data.rating);
    if (isNaN(r) || r < 0 || r > 5) {
      errors.push("rating: 0 ile 5 arasinda bir sayi olmali.");
    }
  }

  if (data.language && !VALID_LANGUAGES.includes(data.language)) {
    errors.push(`language: ${VALID_LANGUAGES.join(", ")} degerlerinden biri olmali.`);
  }

  if (data.difficulty && !VALID_DIFFICULTIES.includes(data.difficulty)) {
    errors.push(`difficulty: ${VALID_DIFFICULTIES.join(", ")} degerlerinden biri olmali veya null.`);
  }

  if (data.notes !== undefined && data.notes !== null && typeof data.notes !== "string") {
    errors.push("notes: String olmali.");
  }

  if (data.coverImage !== undefined && data.coverImage !== null && typeof data.coverImage !== "string") {
    errors.push("coverImage: String (URL) olmali.");
  }

  if (data.isActive !== undefined && typeof data.isActive !== "boolean") {
    errors.push("isActive: true veya false olmali.");
  }

  if (data.isFeatured !== undefined && typeof data.isFeatured !== "boolean") {
    errors.push("isFeatured: true veya false olmali.");
  }

  return {
    valid: errors.length === 0,
    errors,
    formatted: formatJson(text),
  };
};

export const RESOURCE_JSON_TEMPLATE = {
  title: "Kaynak Basligi",
  url: "https://example.com/kaynak",
  type: "makale",
  description: "Kaynak aciklamasi...",
  tags: ["javascript", "frontend"],
  author: "Yazar Adi",
  rating: 4,
  language: "tr",
  difficulty: "orta",
  notes: "",
  coverImage: "https://example.com/cover.jpg",
  isActive: true,
  isFeatured: false,
};

export const RESOURCE_JSON_TEMPLATE_INFO = [
  { label: "title", text: "Kaynak basligi (zorunlu, en az 2 karakter)" },
  { label: "url", text: "Kaynak URL'i (zorunlu, http:// veya https://)" },
  { label: "type", text: "Tur: kitap | video | makale | kurs | arac | diger (varsayilan: diger)" },
  { label: "description", text: "Aciklama (opsiyonel)" },
  { label: "tags", text: "Etiketler dizisi (opsiyonel, orn: [\"react\", \"web\"])" },
  { label: "author", text: "Yazar / kaynak adi (opsiyonel)" },
  { label: "rating", text: "Puan 0-5 (opsiyonel)" },
  { label: "language", text: "Dil: tr | en | de | fr | es (varsayilan: tr)" },
  { label: "difficulty", text: "Zorluk: baslangic | orta | ileri | uzman (opsiyonel)" },
  { label: "notes", text: "Notlar (opsiyonel)" },
  { label: "coverImage", text: "Kapak gorseli URL'i (opsiyonel)" },
  { label: "isActive", text: "Aktif mi? true/false (varsayilan: true)" },
  { label: "isFeatured", text: "One cikan mi? true/false (varsayilan: false)" },
];
