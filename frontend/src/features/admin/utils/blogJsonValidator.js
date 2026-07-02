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
  title: "Blog İçerik Yönetimi ve İnteraktif Bileşenler Kullanım Kılavuzu",
  slug: "interaktif-bilesenler-kullanim-kilavuzu",
  content: `# 🚀 İnteraktif Blog İçerik Yönetimi Kılavuzu

Bu blog yazısı, sistemdeki **tüm interaktif bileşenlerin** nasıl kullanılacağını anlatan, aynı zamanda kendisi de bir örnek olan kapsamlı bir kullanım kılavuzudur. Markdown formatının esnekliği ile zenginleştirilmiş özel bileşenler sayesinde okuyucularınıza benzersiz bir deneyim sunabilirsiniz.

---

## 📊 1. Dinamik Grafikler (Chart)

Verilerinizi görselleştirmek için Recharts tabanlı dinamik grafikler oluşturabilirsiniz. Grafik bileşeni veriyi JSON formatında okur.

**Kullanım Kuralı:** Kod bloğu dili olarak \`chart\` belirleyin ve içerisine JSON objesi yazın.
**Desteklenen Grafik Türleri (type):** \`bar\`, \`line\`, \`area\`, \`pie\`, \`radar\` (Kullanıcı arayüzden de değiştirebilir)

\`\`\`chart
{
  "type": "area",
  "title": "Aylık Kullanıcı Etkileşim İstatistikleri",
  "description": "Son 6 ayın sistem kullanım metrikleri (Gerçek Veri Örneği)",
  "data": [
    { "ay": "Ocak",  "ziyaretci": 1200, "sayfa_goruntuleme": 3400, "etkilesim": 800 },
    { "ay": "Şubat", "ziyaretci": 1800, "sayfa_goruntuleme": 4200, "etkilesim": 1200 },
    { "ay": "Mart",  "ziyaretci": 2400, "sayfa_goruntuleme": 5800, "etkilesim": 1600 },
    { "ay": "Nisan", "ziyaretci": 1900, "sayfa_goruntuleme": 4600, "etkilesim": 1100 },
    { "ay": "Mayıs", "ziyaretci": 3100, "sayfa_goruntuleme": 7200, "etkilesim": 2100 },
    { "ay": "Haziran", "ziyaretci": 2700, "sayfa_goruntuleme": 6300, "etkilesim": 1900 }
  ]
}
\`\`\`

> **İpucu:** \`data\` dizisi içindeki anahtarlar (örn: "ziyaretci", "sayfa_goruntuleme") otomatik olarak grafikteki eksenlere ve çizgilere (line/bar) dönüştürülür. Renkler sistem temasına (Dark Mode) göre otomatik ayarlanır.

---

## 🧠 3. Bilgi Testleri (Interactive Quiz)

Okuyucunun konuyu anlayıp anlamadığını ölçlemek veya gamification (oyunlaştırma) unsurları eklemek için testler oluşturabilirsiniz.

**Kullanım Kuralı:** Kod bloğu dili olarak \`quiz\` belirleyin. JSON objesi şu alanları almalıdır: \`question\`, \`options\` (Dizi), \`answer\` (Doğru şıkkın index'i 0'dan başlar), \`explanation\`, \`hint\` (Opsiyonel).

\`\`\`quiz
{
  "question": "Aşağıdakilerden hangisi React mimarisinde 'Prop Drilling' problemini çözmek için kullanılan yöntemlerden biri DEĞİLDİR?",
  "options": [
    "Context API kullanmak",
    "Redux veya Zustand gibi State Management araçları",
    "Bileşenleri (Component) iç içe çok derin hiyerarşilerde oluşturmak",
    "Component Composition (Bileşen Birleştirme) deseni uygulamak"
  ],
  "answer": 2,
  "explanation": "Bileşenleri çok derin hiyerarşilerde oluşturmak 'Prop Drilling' problemine YOL AÇAR, çözmez. Veriyi aşağı taşımak zorlaşır. Context API, Redux veya Composition bu sorunu çözer.",
  "hint": "Sorunun kök nedeni olan davranışı düşünün."
}
\`\`\`

---

## 💻 4. Canlı Kod Editörü ve Çalıştırma (Playground)

JavaScript kodlarını doğrudan tarayıcı içerisinde (sandbox ortamında) çalıştırılabilir hale getirebilirsiniz. Eğitim yazıları ve algoritmalar için mükemmeldir.

**Kullanım Kuralı:** Kod bloğu dilini \`js:live\`, \`jsx:live\` veya \`javascript:live\` olarak ayarlayın.

\`\`\`js:live
// Asenkron işlemleri ve Promise yapısını anlama
const veriGetir = () => {
  return new Promise((resolve) => {
    console.log("Veriler sunucudan çekiliyor...");
    setTimeout(() => {
      resolve({ user: "Nuh Demir", role: "Software Developer" });
    }, 1500);
  });
};

const uygulamayiBaslat = async () => {
  console.log("Uygulama başlıyor...");
  const data = await veriGetir();
  console.log("Başarılı! Gelen Veri:", data);
};

uygulamayiBaslat();
\`\`\`

> 💡 **Kısayol:** Editöre tıkladıktan sonra kodu çalıştırmak için \`Ctrl + Enter\` (Mac'te \`Cmd + Enter\`) tuşlarına basabilirsiniz.

---

## 📑 5. Sekmeli İçerik Görünümü (Tabs)

Özellikle farklı programlama dillerindeki örnekleri, paket yöneticilerini (npm/yarn) veya alternatif çözümleri aynı anda göstermek için kullanılır.

**Kullanım Kuralı:** Kod bloğu dilini \`tabs\` olarak belirleyin. \`title\` ve \`tabs\` (Dizi) alanlarını içeren bir JSON objesi verin.

\`\`\`tabs
{
  "title": "API İstek Örnekleri (Axios vs Fetch)",
  "tabs": [
    {
      "label": "Axios",
      "icon": "📦",
      "language": "js",
      "content": "import axios from 'axios';\\n\\nconst getData = async () => {\\n  const response = await axios.get('/api/blog');\\n  console.log(response.data);\\n};"
    },
    {
      "label": "Fetch API",
      "icon": "🌐",
      "language": "js",
      "content": "const getData = async () => {\\n  const res = await fetch('/api/blog');\\n  const data = await res.json();\\n  console.log(data);\\n};"
    },
    {
      "label": "cURL",
      "icon": "💻",
      "language": "bash",
      "content": "curl -X GET https://api.example.com/blog \\\\\\n     -H 'Accept: application/json'"
    }
  ]
}
\`\`\`

---

## 🖼️ 6. Görsel Karşılaştırma (Before/After Slider)

Özellikle tasarım değişiklikleri, kod refactoring öncesi/sonrası, fotoğraf filtreleri gibi görsel kıyaslamalar yapmak için kullanılır.

**Kullanım Kuralı:** Standart Markdown görsel ekleme \`![alt metin](url)\` mantığını kullanır. Ancak **alt metinde mutlaka "before-after" kelimesi geçmeli**, parantez içerisindeki bağlantılar ise **"|" (boru) işaretiyle iki URL olarak** ayrılmalıdır. Alt metinde boru işareti kullanarak labelları da belirtebilirsiniz.

**Örnek:** \`![before-after Eski Tasarım | Yeni Tasarım](eski.jpg|yeni.jpg)\`

![before-after Aydınlık Tema | Karanlık Tema](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80|https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80)

---

## 🎨 7. Klasik Markdown Özellikleri Desteği

Tabii ki standart Markdown özellikleri, tablolar ve syntax highlighting da tamamen desteklenmektedir:

| Özellik Türü | Kod Belirteci | Durum |
| :--- | :--- | :---: |
| Kod Blokları | \`js\`, \`css\`, \`html\` | 🟢 Aktif |
| Alıntılar | \`>\` işareti ile | 🟢 Aktif |
| Listeler | \`-\` veya \`1.\` ile | 🟢 Aktif |
| Inline Kod | Tek ters tırnak | 🟢 Aktif |

> Tüm kod bloklarında sağ üstte "Kopyala" butonu otomatik olarak eklenmektedir.

---
**Sonuç:** Bu şablonu kullanarak bloglarınızı sıradan makalelerden çıkarıp, kullanıcıların doğrudan etkileşime girebileceği dijital deneyimlere dönüştürebilirsiniz. Başarılar! 🚀`,
  category: "rehber",
  tags: ["interaktif", "grafik", "quiz", "markdown", "kılavuz", "eğitim"],
  isPublished: false,
  status: "draft",
  excerpt: "Grafikler, Quizler, Canlı JS Editörü, Sekmeli İçerikler ve Öncesi/Sonrası kaydırıcıları gibi tüm interaktif blog bileşenlerinin kapsamlı kullanım kılavuzu.",
  thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
  featured: true,
  seoTitle: "Blog Interaktif Bilesenler Tam Kullanım Kılavuzu | Admin",
  seoDescription: "Sistemde bulunan tüm interaktif Markdown bileşenlerinin detaylı dokümantasyonu, JSON yapısı ve örnek kullanımları.",
  publishedAt: "2026-06-28T12:00:00.000Z"
};

export const BLOG_JSON_TEMPLATE_INFO = [
  { label: "title", text: "Blog başlığı (zorunlu, en az 3 karakter)" },
  { label: "slug", text: "Özel URL uzantısı (opsiyonel, örn: 'benim-yazim'). Boş bırakılırsa başlıktan üretilir." },
  { label: "content", text: "İçerik - Markdown formatında. Standart tablo/liste haricinde interaktif bileşenler (chart, quiz, mermaid, js:live, tabs) destekler. (zorunlu)" },
  { label: "category", text: "Kategori adı (opsiyonel, örn: 'teknoloji', 'rehber')" },
  { label: "tags", text: "Etiketler dizisi (opsiyonel, örn: [\"react\", \"web\"])" },
  { label: "isPublished", text: "Yayında mı? true/false. True olduğunda herkes tarafından görülebilir." },
  { label: "status", text: "Durum: draft | published | archived | scheduled (isPublished true ise otomatik published olur)" },
  { label: "publishedAt", text: "Yayın tarihi (opsiyonel, ISO format: '2026-06-28T12:00:00Z')" },
  { label: "excerpt", text: "Kısa özet - Listelerde ve SEO aramalarında görünür (opsiyonel)" },
  { label: "thumbnailUrl", text: "Kapak görseli URL'i (opsiyonel, Cloudinary, Unsplash vb.)" },
  { label: "seoTitle", text: "Arama motorları için özel başlık (opsiyonel, boşsa title kullanılır)" },
  { label: "seoDescription", text: "Arama motorları için meta açıklaması (opsiyonel, boşsa excerpt kullanılır)" }
];
