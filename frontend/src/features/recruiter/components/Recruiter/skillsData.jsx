import React from "react";
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaDocker,
  FaGitAlt,
  FaFigma,
  FaSass,
} from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiMongodb,
  SiPostgresql,
  SiGraphql,
  SiVite,
  SiNextdotjs,
  SiFlutter,
} from "react-icons/si";

export const skillsData = [
  {
    category: "Frontend",
    skills: [
      {
        name: "React",
        icon: <FaReact color="#61DAFB" />,
        description:
          "Bileşen tabanlı, interaktif kullanıcı arayüzleri oluşturma ve state yönetimi (Context API, Reducer).",
        projectIds: ["proj-01", "proj-04"],
      },
      {
        name: "Next.js",
        icon: <SiNextdotjs />,
        description:
          "Sunucu tarafı render (SSR) ve statik site üretimi (SSG) ile SEO dostu, yüksek performanslı uygulamalar.",
        projectIds: [],
      },
      {
        name: "JavaScript (ES6+)",
        icon: <SiJavascript color="#F7DF1E" />,
        description:
          "Modern JavaScript özellikleri, asenkron programlama ve DOM manipülasyonu konularında derin bilgi.",
        projectIds: ["proj-01", "proj-04"],
      },
      {
        name: "TypeScript",
        icon: <SiTypescript color="#3178C6" />,
        description:
          "Büyük ölçekli projelerde tip güvenliği sağlayarak hataları azaltma ve kod kalitesini artırma.",
        projectIds: [],
      },
      {
        name: "HTML5 & SASS",
        icon: <FaSass color="#CC6699" />,
        description:
          "Anlamsal HTML ve modüler, sürdürülebilir CSS/SASS mimarileri oluşturma.",
        projectIds: ["proj-01"],
      },
      {
        name: "GSAP & Framer Motion",
        icon: <div className="framer-icon">F</div>,
        description:
          "Kullanıcı deneyimini zenginleştiren akıcı ve performanslı web animasyonları tasarlama.",
        projectIds: ["proj-01"],
      },
    ],
  },
  {
    category: "Backend",
    skills: [
      {
        name: "Node.js & Express",
        icon: <FaNodeJs color="#339933" />,
        description:
          "Ölçeklenebilir ve hızlı RESTful API'ler ve sunucu tarafı uygulamalar geliştirme.",
        projectIds: ["proj-02"],
      },
      {
        name: "Python (Flask)",
        icon: <FaPython color="#3776AB" />,
        description:
          "Veri işleme, otomasyon scriptleri ve web servisleri için Python kullanma tecrübesi.",
        projectIds: [],
      },
      {
        name: "MongoDB",
        icon: <SiMongodb color="#47A248" />,
        description:
          "NoSQL veritabanı modellemesi, Mongoose ile şema tasarımı ve verimli sorgular yazma.",
        projectIds: ["proj-02"],
      },
      {
        name: "PostgreSQL",
        icon: <SiPostgresql color="#336791" />,
        description:
          "İlişkisel veritabanı tasarımı, SQL sorguları ve veri bütünlüğünü sağlama.",
        projectIds: [],
      },
    ],
  },
  {
    category: "Mobile & Tools",
    skills: [
      {
        name: "Flutter & Dart",
        icon: <SiFlutter color="#02569B" />,
        description:
          "Tek bir kod tabanı ile hem iOS hem de Android için yüksek performanslı mobil uygulamalar geliştirme.",
        projectIds: ["proj-03"],
      },
      {
        name: "Git & GitHub",
        icon: <FaGitAlt color="#F05032" />,
        description:
          "Versiyon kontrolü, branch yönetimi ve takım çalışması için temel bir araç.",
        projectIds: ["proj-01", "proj-02", "proj-03", "proj-04"],
      },
      {
        name: "Docker",
        icon: <FaDocker color="#2496ED" />,
        description:
          "Uygulamaları konteynerize ederek geliştirme ve dağıtım süreçlerini standartlaştırma.",
        projectIds: [],
      },
      {
        name: "Figma",
        icon: <FaFigma color="#F24E1E" />,
        description:
          "Kullanıcı arayüzü (UI) ve kullanıcı deneyimi (UX) tasarımlarını anlama ve geliştirme sürecine aktarma.",
        projectIds: [],
      },
    ],
  },
];

// Proje verilerini de buraya alalım ki linkleme yapabilelim
import projects from "@features/projects/data/projects.json";
export const projectsData = projects;
