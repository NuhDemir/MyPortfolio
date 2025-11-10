# Backend Modular Monolith Görevi

## 1. Hazırlık

- Mevcut kod tabanını ve bağımlılıkları envanterle.
- `backend` klasöründe kullanılmayan dosyaları, servisleri ve middleware'leri belirle.
- `.env` örnek dosyasını güncelleyerek ortam değişkenlerini dokümante et.

## 2. Hedef Mimari

- Katmanları belirle: `interfaces` (HTTP katmanı), `application` (use-case hizmetleri), `domain` (model + domain servisleri), `infrastructure` (ORM, repo, entegrasyonlar).
- Modüler monolith yaklaşımıyla her bounded context için klasör aç: `auth`, `blog`, `project`, `settings`, `media`.
- Ortak paketler için `shared` klasörü oluştur (hatalar, utils, base sınıfları, event publisher/policy vb.).

## 3. Dizayn Kararları

- Domain modellerini saf POJO/Entity objeleri olarak ayrıştır; Mongoose şemalarını `infrastructure` katmanında tanımla.
- Her modül için `application` katmanında use-case servisleri oluştur (ör. `auth/application/LoginUserUseCase.js`).
- Repository arayüzleri `domain` içinde tanımlansın, implementasyonları `infrastructure` altında Mongoose ile yazılsın.
- HTTP katmanı için Express routerları her modülün `interfaces/http` klasörüne taşı.
- Validasyon (Joi/Yup/Zod) kurallarını `interfaces` yerine `application` katmanında input DTO olarak yeniden yaz.

## 4. Refactor Adımları

1. Proje yapısını yeniden düzenle (klasör/isim değişiklikleri).
2. Ortak hata yakalama ve logger’ı `shared` altında modüler hale getir.
3. Middleware'leri yeniden yaz:
   - Kimlik doğrulama ve yetkilendirme modül bazlı policy olarak tanımla.
   - Upload & validation middleware'lerini servis bağımlılıklarından ayır.
4. Her modül için bağımsız servis sınıflarını `application` katmanına taşı; controller'lar sadece use-case çağıracak.
5. Repository katmanını interface + implementasyon olarak böl; servisler interface üzerinden çalışacak.
6. `config/db.js` ve diğer altyapı kodlarını `infrastructure/database` ve `infrastructure/config` altına taşı.
7. Event ve domain servislerini (örn. slug üretimi) `shared` utils + domain service yapısına dönüştür.
8. Express başlangıç dosyalarını (`server.js`, `app.js`) yeniden düzenle: modül kayıtları, global middleware, health check.

## 5. Test Stratejisi

- Birim test: Jest kullan; domain servisleri ve use-case'ler için izolasyon.
- Entegrasyon testleri: Supertest ile HTTP endpoint'lerinin kontratını doğrula.
- Veri tabanı için in-memory MongoDB (mongodb-memory-server) kullan.
- Test klasör yapısı: `tests/unit/<modül>`, `tests/integration/<modül>`.
- Kod kapsam hedefi: %80 üzeri; `npm run test:coverage` komutu ekle.

## 6. Performans ve Optimizasyon

- Caching: Sık kullanılan okuma operasyonları için Redis entegre et (örn. blog listeleri).
- DTO seviyesinde gereksiz alanları kaldır, seri hale getirmeyi optimize et.
- Query optimizasyonu: Mongoose index'lerini gözden geçir, `lean()` kullanımını yaygınlaştır.
- Upload işlemleri için streaming yaklaşımını değerlendir.
- Logger'ı asenkron ve seviyelendirilmiş (winston/pino) hale getir.

## 7. Güvenlik ve Dayanıklılık

- Rate limiting ve brute force koruması ekle (örn. `express-rate-limit`).
- Helmet ve CORS yapılandırmalarını modül bağımsız yönet.
- Audit log ve izleme için merkezi bir servis oluştur.
- Graceful shutdown ve sağlık kontrolleri (`/health`, `/ready`) ekle.

## 8. CI/CD ve Dokümantasyon

- `package.json` script'lerini güncelle (`lint`, `test`, `build`, `start:prod`).
- GitHub Actions veya benzeri pipeline ile test + lint + build aşamalarını otomatikleştir.
- OpenAPI/Swagger dokümantasyonu oluştur; modül bazlı endpoint şemaları.
- `docs` altında her modül için ADR (Architecture Decision Record) tut.

## 9. Teslim Kriterleri

- Tüm testler başarılı.
- Kod kalitesi ölçümleri (ESLint, Prettier, coverage) eşik değerlerinin üzerinde.
- Performans metrikleri: kritik endpoint'lerde response time < 200ms (ortalama).
- Dokümantasyon güncel ve yeni mimariyi açıklıyor.
- İnceleme listesindeki (code review checklist) maddeler karşılanmış.
