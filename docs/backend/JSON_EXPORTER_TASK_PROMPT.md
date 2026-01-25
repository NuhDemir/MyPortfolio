# Admin JSON Exporter (Project + Blog) — Geliştirme Promptu

## Amaç

Admin panelde **Project** ve **Blog** modülleri için "JSON Exporter" özelliği geliştir.
Bu özellik, adminin sistemdeki tüm proje/blog kayıtlarını **içerikleriyle birlikte** tek bir JSON dosyası olarak indirmesini sağlar.

## Kapsam ve Gereksinimler

- Backend’de admin yetkisi gerektiren iki endpoint ekle:
  - `GET /api/projects/export/json` (admin-only)
  - `GET /api/blogs/export/json` (admin-only)
- Endpoint’ler "download" davranışı vermeli:
  - `Content-Type: application/json; charset=utf-8`
  - `Content-Disposition: attachment; filename="..."`
- Export payload formatı standart olmalı:
  - `type`: `"projects" | "blogs"`
  - `exportedAt`: ISO string
  - `count`: number
  - `items`: exported entity array
- Blog export’unda **markdown içerik kaybolmamalı**:
  - JSON içinde `content` alanı markdown olarak saklansın
  - Ek olarak `contentHtml` alanı da üret (frontend/UI ve arşivleme için)
- Security:
  - Sadece `admin` rolü erişebilmeli (mevcut `protect` + `authorizeAdmin` kullanılacak)
  - Public route’lara yetkisiz veri sızdırma yok

## Uygulama Notları

- Route sıralamasına dikkat et:
  - `/:id` veya `/:slug` gibi dinamik route’lar, `export/json` path’ini yutmasın.
- Büyük veri setleri için JSON’u okunabilir şekilde (pretty) dönebilirsin.
- Mevcut servis davranışlarını (list/get) bozmadan export için ayrı bir metot ekle.

## Doğrulama

- Unit test:
  - Blog export metodu için `content` ve `contentHtml` birlikte üretiliyor mu?
- Manuel test:
  - Admin token ile endpoint çağrıldığında indirme başlıyor mu?
  - Admin olmayan token ile `403` alınıyor mu?
