import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

const DEFAULTS = [
  {
    year: "2023 – 2024", title: "Yazılım & Siber Güvenlik Eğitmeni", subtitle: "Deneyap Teknoloji Atölyeleri",
    desc: "Full stack geliştirme ve Linux tabanlı sistemler (Kali, Red Hat) eğitimi verdim. Öğrenci gruplarına güvenli kodlama pratikleri ve sistem yönetimi konularında mentörlük yaptım.",
    detail: "Haftalık atölye programları hazırlayarak 30+ öğrenciye yazılım geliştirme ve siber güvenlik temellerini aktardım. CTF yarışmaları ve uygulamalı lab çalışmaları düzenledim.",
  },
  {
    year: "2022 – 2023", title: "Ağ Altyapı Stajyeri", subtitle: "Ankara Orman Bölge Müdürlüğü",
    desc: "Kurumsal ağ altyapısının kurulumu, yönetimi ve güvenlik sıkılaştırması süreçlerinde görev aldım.",
    detail: "Network cihaz konfigürasyonu, firewall yönetimi ve sistem izleme araçlarının kurulumunda aktif rol aldım. Kurumsal IT altyapı yönetimi konusunda saha deneyimi kazandım.",
  },
  {
    year: "2021 – 2026", title: "Bilgisayar Teknolojisi ve Bilişim Sistemleri", subtitle: "Bartın Üniversitesi",
    desc: "Yazılım mühendisliği, veritabanı sistemleri ve ağ güvenliği alanlarında akademik eğitim.",
    detail: "Data Mining, Database Architecture, Web Development, Algorithms ve UI/UX Design Principles derslerinde uzmanlaştım. Bölüm projelerinde tam yığın uygulama geliştirme deneyimi kazandım.",
  },
];

const TimelineItem = ({ item, isOpen, onToggle, isLast }) => {
  const detailRef = useRef(null);

  useEffect(() => {
    if (!detailRef.current) return;
    if (isOpen) {
      gsap.fromTo(detailRef.current, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" });
    } else {
      gsap.to(detailRef.current, { height: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
    }
  }, [isOpen]);

  return (
    <div className={`about3__timeline-item ${isOpen ? "about3__timeline-item--open" : ""} ${isLast ? "about3__timeline-item--last" : ""}`}>
      <button type="button" className="about3__timeline-trigger" onClick={onToggle} aria-expanded={isOpen}>
        <div className="about3__timeline-year">{item.year}</div>
        <h3 className="about3__timeline-title">{item.title}</h3>
        {item.subtitle && <p className="about3__timeline-sub">{item.subtitle}</p>}
        <p className="about3__timeline-desc">{item.desc}</p>
      </button>
      <div ref={detailRef} className="about3__timeline-detail" style={{ height: 0, opacity: 0, overflow: "hidden" }}>
        <p>{item.detail}</p>
      </div>
    </div>
  );
};

export const Timeline = ({ items = [] }) => {
  const list = items.length > 0 ? items : DEFAULTS;
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section>
      <h2 className="about3__section-title">Deneyim</h2>
      <div className="about3__timeline">
        {list.map((item, i) => (
          <TimelineItem
            key={item.year}
            item={item}
            isOpen={openIndex === i}
            isLast={i === list.length - 1}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
};
