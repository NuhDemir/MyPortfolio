import React from "react";

export const Bio = ({ paragraphs = [] }) => (
  <section className="about3__bio">
    <h2 className="about3__section-title">Hakkımda</h2>
    {paragraphs.length > 0 ? (
      paragraphs.map((text, i) => <p key={i}>{text}</p>)
    ) : (
      <>
        <p>
          Bartın Üniversitesi Bilgisayar Teknolojisi ve Bilişim Sistemleri
          bölümünde öğrenim gören, modern web ve mobil teknolojilerde
          uzmanlaşmış bir Full Stack geliştiriciyim. React 19, Next.js 16,
          TypeScript, Node.js ve NestJS ekosistemlerinde derinlemesine
          deneyime sahibim.
        </p>
        <p>
          Monorepo mimariler, RESTful API tasarımı, veritabanı mühendisliği
          ve 60 FPS mobil uygulama geliştirme konularında uzmanlaştım.
          Frontend'de Feature-Sliced Design (FSD), Server Components ve
          PWA; backend'de Modular Monolith, DDD ve Clean Architecture
          prensipleriyle çalışıyorum.
        </p>
      </>
    )}
  </section>
);
