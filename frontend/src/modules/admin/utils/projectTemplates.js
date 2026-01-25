export const projectV2JsonTemplate = [
  {
    id: "project-digital-obesity",
    slug: "digital-obesity",
    isFeatured: true,
    metadata: {
      title: "Digital Obesity",
      tagline:
        "Modern Çağın Sorunu: Dijital Obezite ve Bilgi Yükü Farkındalığı",
      createdAt: "2024-11-10",
      role: "Frontend Developer & UI Designer",
      platform: "Web Application",
      status: "Live",
    },
    visuals: {
      thumbnailUrl: "/assets/projects/digital-obesity/thumb.webp",
      heroVideoUrl: "/assets/projects/digital-obesity/preview.mp4",
      primaryColor: "#0cb845",
    },
    techStack: [
      { category: "Core", items: ["React", "Vite", "TypeScript"] },
      {
        category: "Styling & UI",
        items: ["SCSS Modules", "Neu Brutalism", "Framer Motion"],
      },
      {
        category: "Performance",
        items: ["Lighthouse Optimization", "Code Splitting"],
      },
    ],
    links: {
      liveDemo: "https://digital-obesity.netlify.app/",
      github: "https://github.com/kullaniciadi/digital-obesity",
      figma: "https://figma.com/file/digital-obesity-design",
    },
    caseStudy: {
      problem: {
        title: "Sonsuz Akış ve Dikkat Dağınıklığı",
        description:
          "Kullanıcılar modern web'de 'Infinite Scroll' ve bildirim yağmuru altında eziliyor. Standart arayüzler, kullanıcıyı sürekli tüketime teşvik ederek bilişsel yorgunluğa (dijital obeziteye) sebep oluyor.",
      },
      solution: {
        title: "Rahatsız Edici Sadelik: Neu Brutalism",
        description:
          "Kullanıcıyı yavaşlatmak ve düşündürmek için 'Anti-UX' prensiplerinden beslenen, yüksek kontrastlı ve ham (raw) bir arayüz tasarlandı. Görsel gürültü, bilinçli bir tasarım tercihi olarak kullanıldı.",
      },
      challenges: [
        {
          title: "Kaotik Tasarımda Performans Koruması",
          description:
            "Neu Brutalism tarzı yoğun gölgeler, borderlar ve üst üste binen elementler içerir. Bu 'kaosun' DOM boyutunu şişirmemesi ve render performansını (FPS) düşürmemesi için CSS 'will-change' optimizasyonları ve sanallaştırılmış listeler (virtualization) kullanıldı.",
        },
      ],
      metrics: [
        { label: "Lighthouse Performans", value: "98/100" },
        { label: "Ort. Sitede Kalma", value: "3.5 dk" },
        { label: "Bounce Rate", value: "%12 Düşüş" },
      ],
      highlightCode: {
        language: "typescript",
        fileName: "useGlitchEffect.ts",
        codeSnippet:
          "export const useGlitchEffect = (intensity: number) => {\n  const [offset, setOffset] = useState({ x: 0, y: 0 });\n\n  useEffect(() => {\n    if (intensity === 0) return;\n    const interval = setInterval(() => {\n      setOffset({\n        x: (Math.random() - 0.5) * intensity,\n        y: (Math.random() - 0.5) * intensity\n      });\n    }, 50);\n    return () => clearInterval(interval);\n  }, [intensity]);\n\n  return offset;\n};",
      },
    },
  },
];

export const projectJsonUploadTitle = "JSON ile Proje Yükle";

export const projectJsonUploadPlaceholder =
  "JSON verilerini buraya yapıştırın (tek proje objesi veya proje dizisi)...";

export const projectJsonTemplateDescription =
  "Proje eklemek için aşağıdaki JSON formatını kullanın. Tek obje veya dizi gönderebilirsiniz.";

export const projectV2JsonTemplateInfoItems = [
  { label: "metadata.title", text: "Proje başlığı (zorunlu)" },
  { label: "metadata.tagline", text: "Kısa açıklama (zorunlu)" },
  { label: "visuals.thumbnailUrl", text: "Kapak görseli URL’i (zorunlu)" },
  { label: "links.github", text: "GitHub URL (opsiyonel)" },
  { label: "links.liveDemo", text: "Canlı URL (opsiyonel)" },
  { label: "techStack", text: "Kategori + item listeleri (opsiyonel)" },
  {
    label: "caseStudy",
    text: "problem/solution/metrics/highlightCode (opsiyonel)",
  },
  { label: "isFeatured", text: "true/false (opsiyonel)" },
  {
    label: "metadata.status",
    text: "Live/Development/Beta/Legacy (opsiyonel)",
  },
];
