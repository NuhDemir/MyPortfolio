# Project Details – Senior UI/UX Integration Prompt

Amaç: `/projects/:slugOrId` detay sayfası; **ilk 3 saniyede** başlık/tagline/CTA net, aşağı kaydırırken **sticky context bar**, içerik **taranabilir bento grid**, süreç kanıtları (before/after, diagram, wireframe), teknik deep dive (şık code snippet), micro-interactions (reveal/hover video), lightbox ve footer’da next project + iletişim CTA.

## UX Checklist

1. **Hero (Fold üstü)**

- Büyük başlık (H1) + güçlü tagline.
- CTA butonları: `Live Demo` ve `GitHub` _her zaman fold üstünde_.
- Hero media: autoplay (muted) video/GIF tercih; fallback olarak image.

2. **Sticky Context Bar**

- Rol, Süre, Takım, Tech Stack (ikon yığını değil, metin), Tarih.
- Scroll sırasında görünür kalmalı (position: sticky).

3. **Scannability / Hiyerarşi**

- Bento grid kartları: Problem / Solution / Metrics / Highlights.
- Büyük başlıklar + kısa paragraflar + rahat line-height.

4. **Process Kanıtı**

- Before/After slider (opsiyonel: `visuals.beforeImageUrl`, `visuals.afterImageUrl`).
- Architecture diagram (opsiyonel: `visuals.architectureDiagramUrl`).
- Wireframe / user flow (opsiyonel: `visuals.wireframeUrl`).

5. **Teknik Deep Dive**

- VS Code hissiyatlı code snippet.
- `caseStudy.highlightCode` ile 10–15 satır kritik çözüm.

6. **Micro-Interactions**

- Scroll reveal (IntersectionObserver).
- Video hover: üstüne gelince oynat, çıkınca durdur.
- Lightbox: görsele tıklayınca full-screen.

7. **Footer / Next Step**

- “Next Project” kartı.
- İletişim CTA (home `#contact-section`).

## Data Expectations (V2)

Minimum (Hero için):

- `metadata.title`
- `metadata.tagline`
- `visuals.thumbnailUrl` veya legacy `imageUrl`
- `links.liveDemo` ve/veya legacy `liveUrl`
- `links.github` ve/veya legacy `githubUrl`

Gelişmiş:

- `metadata.role`, `metadata.duration`, `metadata.team`, `metadata.createdAt`
- `techStack: [{ category, items: string[] }]`
- `caseStudy.problem/solution/challenges/metrics/highlightCode`
- `visuals.heroVideoUrl`
- `visuals.beforeImageUrl`, `visuals.afterImageUrl`
- `visuals.architectureDiagramUrl`, `visuals.wireframeUrl`
- `visuals.gallery: [{ url, alt?, caption? }]`

## Implementation Notes

- Vite/React Router: route `"/projects/:slugOrId"`.
- Details page **fallback-first**: `/projects` list fetch + local JSON fallback.
- Matching: slug/id/\_id/externalId + title-slug fallback.
- Accessibility: keyboard focus, aria labels, Escape to close lightbox.
- Performance: hero media eager, below-fold images lazy.
