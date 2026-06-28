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

  if (data.slug !== undefined && data.slug !== null && typeof data.slug !== "string") {
    errors.push("slug: String olmali.");
  }

  if (data.seoTitle !== undefined && data.seoTitle !== null && typeof data.seoTitle !== "string") {
    errors.push("seoTitle: String olmali.");
  }

  if (data.seoDescription !== undefined && data.seoDescription !== null && typeof data.seoDescription !== "string") {
    errors.push("seoDescription: String olmali.");
  }

  if (data.publishedAt !== undefined && data.publishedAt !== null && isNaN(Date.parse(data.publishedAt))) {
    errors.push("publishedAt: Gecerli bir ISO tarih formati olmali (orn: 2026-06-28T12:00:00Z).");
  }

  return {
    valid: errors.length === 0,
    errors,
    formatted: formatJson(text),
  };
};

export const BLOG_JSON_TEMPLATE = {
  title: "Kapsamli Blog Sablonu: Interaktif Bilesenler Rehberi",
  slug: "kapsamli-blog-sablonu-interaktif-rehber",
  content: `# Interaktif Blog Bilesenlerinin Tam Rehberi

Bu blog yazisinda kullanabileceginiz **tum interaktif bilesenler** asagida orneklerle aciklanmistir.

## 1. Dinamik Grafik (Chart)

\`\`\`chart
{
  "type": "bar",
  "title": "Aylik Ziyaretci Istatistikleri",
  "description": "Son 6 ayin benzersiz ziyaretci sayilari",
  "data": [
    { "ay": "Ocak",  "ziyaretci": 1200, "sayfa_goruntuleme": 3400 },
    { "ay": "Subat", "ziyaretci": 1800, "sayfa_goruntuleme": 4200 },
    { "ay": "Mart",  "ziyaretci": 2400, "sayfa_goruntuleme": 5800 },
    { "ay": "Nisan", "ziyaretci": 1900, "sayfa_goruntuleme": 4600 },
    { "ay": "Mayis", "ziyaretci": 3100, "sayfa_goruntuleme": 7200 },
    { "ay": "Haziran", "ziyaretci": 2700, "sayfa_goruntuleme": 6300 }
  ]
}
\`\`\`

> Kullanici grafik turlerini (Bar, Line, Area, Pie, Radar) usteki sekmelerden secebilir.

## 2. Akis Semasi (Mermaid Diagram)

\`\`\`mermaid
graph TD
  A[Kullanici Istegi] --> B{Kimlik Dogrulama}
  B -->|Basarili| C[API Gateway]
  B -->|Basarisiz| D[401 Hatasi]
  C --> E[Service Layer]
  E --> F[(Veritabani)]
  E --> G[Cache Redis]
  F --> H[Response]
  G --> H
\`\`\`

## 3. Bilgi Testi (Quiz)

\`\`\`quiz
{
  "question": "React'ta bir bilesenin yeniden render edilmesini onlemek icin hangi hook kullanilir?",
  "options": [
    "useEffect",
    "useMemo",
    "React.memo",
    "useCallback"
  ],
  "answer": 2,
  "explanation": "React.memo, bir bileseni sarar ve props degismediginde yeniden render'i onler. useMemo ise bir degerin hesaplanmasini, useCallback ise bir fonksiyonun yeniden olusturulmasini onler.",
  "hint": "Bir Higher Order Component (HOC)'tur."
}
\`\`\`

## 4. Canli Kod Editorü (Code Playground)

Asagidaki kodu duzenleyip Calistir butonuna basin:

\`\`\`js:live
// Fibonacci dizisini hesapla
const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

for (let i = 0; i <= 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}
\`\`\`

## 5. Sekmeli Icerik (Tabs)

\`\`\`tabs
{
  "title": "Farkli Dillerde Merhaba Dunya",
  "tabs": [
    {
      "label": "JavaScript",
      "icon": "🟨",
      "language": "js",
      "content": "const greeting = 'Merhaba Dunya';\nconsole.log(greeting);"
    },
    {
      "label": "Python",
      "icon": "🐍",
      "language": "py",
      "content": "greeting = 'Merhaba Dunya'\nprint(greeting)"
    },
    {
      "label": "Go",
      "icon": "🐹",
      "language": "go",
      "content": "package main\\n\\nimport \\"fmt\\"\\n\\nfunc main() {\\n  fmt.Println(\\"Merhaba Dunya\\")\\n}"
    }
  ]
}
\`\`\`

## 6. Once / Sonra Kaydirici (Before / After Slider)

Asagidaki sentaksi kullanin. alt metin \`before-after\` kelimesini icermeli, src ise \`|ile ayrilan iki URL\` olmali:

![before-after Once|Sonra](https://res.cloudinary.com/dahmmlu7u/image/upload/v1782399637/portfolio/solidprincipl.jpg|https://res.cloudinary.com/dahmmlu7u/image/upload/v1782399637/portfolio/solidprincipl.jpg)

## 7. Normal Kod Blogu (Syntax Highlighted)

\`\`\`typescript
interface BlogPost {
  title: string;
  content: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
}

const createPost = (data: BlogPost): BlogPost => {
  return { ...data, publishedAt: new Date() };
};
\`\`\`

## 8. Tablo (Table)

| Bilesen     | Markdown Kodu      | Interaktif |
| ----------- | ------------------ | ---------- |
| Grafik      | \\\`\\\`\\\`chart    | Evet       |
| Mermaid     | \\\`\\\`\\\`mermaid  | Evet       |
| Quiz        | \\\`\\\`\\\`quiz     | Evet       |
| Playground  | \\\`\\\`\\\`js:live  | Evet       |
| Sekmeler    | \\\`\\\`\\\`tabs     | Evet       |
| Once/Sonra  | Ozel img sentaksi  | Evet       |

---

Iyi yazi yazmalari!`,
  category: "rehber",
  tags: ["interaktif", "grafik", "quiz", "markdown", "rehber"],
  isPublished: false,
  status: "draft",
  excerpt: "Blog yazisinda kullanabileceginiz tum interaktif bilesenler: Grafik, Mermaid, Quiz, Canli Kod Editoru, Sekmeli Icerik ve Once/Sonra Kaydirici.",
  thumbnailUrl: "https://example.com/cover-image.jpg",
  featured: true,
  seoTitle: "Interaktif Blog Bilesenlerinin Tam Rehberi",
  seoDescription: "Grafik, Quiz, Canli Kod ve Mermaid diyagramlarini blog yazilarina nasil eklersiniz ogrenin.",
  publishedAt: "2026-06-28T12:00:00.000Z"
};

export const BLOG_JSON_TEMPLATE_INFO = [
  { label: "title", text: "Blog başlığı (zorunlu, en az 3 karakter)" },
  { label: "slug", text: "Özel URL uzantısı (opsiyonel, örn: 'benim-yazim')" },
  { label: "content", text: "İçerik - Markdown formatında. Tablo, liste, kod ve görsel destekler (zorunlu)" },
  { label: "category", text: "Kategori adı (opsiyonel, örn: 'teknoloji')" },
  { label: "tags", text: "Etiketler dizisi (opsiyonel, örn: [\"react\", \"web\"])" },
  { label: "isPublished", text: "Yayında mı? true/false (opsiyonel)" },
  { label: "status", text: "Durum: draft | published | archived | scheduled (opsiyonel)" },
  { label: "publishedAt", text: "Yayın tarihi (opsiyonel, ISO format: '2026-06-28T12:00:00Z')" },
  { label: "excerpt", text: "Kısa özet - Listelerde ve kartlarda görünür (opsiyonel)" },
  { label: "thumbnailUrl", text: "Kapak görseli URL'i (opsiyonel, Cloudinary vb.)" },
  { label: "featured", text: "Öne çıkan gönderi mi? true/false (opsiyonel)" },
  { label: "seoTitle", text: "Arama motorları (SEO) için özel başlık (opsiyonel)" },
  { label: "seoDescription", text: "Arama motorları (SEO) için özel açıklama (opsiyonel)" },
];
