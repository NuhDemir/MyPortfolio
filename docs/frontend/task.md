# Frontend Katmanlı Mimari ve Admin Paneli Görevi

## 1. Hazırlık

- Mevcut `frontend` kod tabanının komponent, sayfa ve servis envanterini çıkar.
- Tasarım sisteminde kullanılan stil dosyalarını, ikon ve statik varlıkları listele.
- Backend API kontratını (`auth`, `blog`, `project`) gözden geçir, eksik endpoint veya DTO farklarını not al.
- Hedeflediğimiz tarayıcı desteği ve performans ölçütlerini (bundle size, LCP, TTI) belirle.

## 2. Hedef Mimari

- Katmanlı yapı kur:
  - `app/` (giriş noktası, yönlendirme, tema sağlayıcıları, global layout)
  - `core/` (genel util fonksiyonlar, hook'lar, config, http katmanı)
  - `modules/` altında bounded context bazlı klasörler (`auth`, `blog`, `project`, `admin`)
  - `shared/` içerisinde UI bileşenleri, form elemanları, ikonlar ve tipler
- Dosya isimlendirme standartları: PascalCase bileşenler, camelCase util/hook, `index.tsx` yerine anlamlı dosya isimleri kullan.
- State yönetimi için React Context + custom hook yaklaşımını modül sınırlarına göre yeniden düzenle (gerekirse Zustand/Redux değerlendirmesi yap).

## 3. Dizayn Kararları

- Admin paneli bağımsız bir modül olarak konumlandırılacak; routing, layout, izin kontrolü bu modül içinde çözülecek.
- API katmanı tek bir `http` adaptörü (Axios instance) üzerinden yönetilecek; modüller kendi service sınıflarını kullanacak.
- Form validasyonunda React Hook Form + Zod kullanılacak; tipler `modules/<context>/types` altında tutulacak.
- Responsive grid ve tema sistemi için mevcut CSS dosyaları `shared/ui` altına taşınıp modüler hale getirilecek.
- Yol haritası üretilebilirlik için komponent kataloğu (Storybook veya Ladle) kurulumu değerlendirilecek.

## 4. Refactor Adımları

1. `src/` klasörünü yeni hedef yapıya uygun şekilde yeniden düzenle (klasör taşıma + barrel file temizliği).
2. Axios instance'ı `core/http` altına taşı, interceptors ve hata yönetimini güncelle.
3. Ortak hook'ları (`useSound`, `useGsapAnimation` vb.) gözden geçir, tekrar edenleri konsolide et.
4. `modules/admin` altında aşağıdaki alt yapıyı oluştur:
   - `pages/`: Dashboard, Login, ProjectManagement, BlogManagement
   - `components/`: Sidebar, Navbar, Charts, Tables
   - `services/`: AdminAuthService, AdminProjectService vb.
   - `hooks/`: `useAdminGuard`, `useProjectTable`, `useBlogForm`
5. Admin navigasyonu ve yetki kontrolü için `ProtectedRoute` yapısını `core/routing` altına taşıyıp tekrar kullanılabilir hale getir.
6. Modül bazlı stil organizasyonu yap (`modules/<context>/styles/`), global CSS dosyalarını minimuma indir.
7. Gerekli yerlerde i18n/içerik yönetimi için `core/i18n` yapısı hazırlığı (en/tr json dosyaları).
8. Eski dosya yollarına göre import eden modülleri güncelle, dead-code taraması yap.

## 5. Admin Paneli Tamamlama Planı

- **Kimlik Doğrulama**: Login sayfasını backend `auth/login` endpoint'iyle entegre et, token'ı güvenli storage'ta tut.
- **Dashboard**: Özet metrikler (toplam proje, blog, son login), grafik veya kart bileşenleri.
- **Projeler Yönetimi**: CRUD ekranı (listeleme, filtreleme, form modal'ı, upload), optimistic UI + toast geri bildirimi.
- **Blog Yönetimi**: Markdown editörü, etiket yönetimi, yayınlama durumu değişiklikleri.
- **Rol/İzin Kontrolü**: `admin` ve ileride eklenecek diğer roller için guard mekanizması.

## 6. Test Stratejisi

- Unit test: React Testing Library + Vitest/Jest kullan; component ve hook seviyesinde kapsam oluştur.
- Entegrasyon testleri: `msw` ile API mock'ları, routing + form submit akışlarını doğrula.
- E2E: Playwright veya Cypress ile kritik kullanıcı akışlarını (admin login, proje oluşturma) otomatikleştir.
- Lighthouse/Bundle analizleri için `npm run analyze` script'i oluştur; CI'da hatırlatma eşikleri ayarla.

## 7. Performans & Optimizasyon

- Kod bölme (dynamic import) stratejisi belirle, admin modülünü lazy load yap.
- Re-render analizlerini profiler ile yap, memoization fırsatlarını değerlendir.
- Asset optimizasyonu: statik görselleri webp'ye çevir, ikonları sprite veya SVG component olarak kullan.
- PWA/Service Worker desteğini değerlendir (offline admin gerekmiyorsa isteğe bağlı).

## 8. Güvenlik & Dayanıklılık

- Token yenileme (refresh flow) ve otomatik logout senaryolarını kurgula.
- Formlarda XSS/HTML injection koruması (sanitize) uygula.
- Çevrimdışı durumlar için global error boundary ve fallback UI ekle.
- Çevresel değişken yönetimini `.env` + Vite `import.meta.env` standardına göre güncelle, gizli bilgileri sızdırma.

## 9. CI/CD & Dokümantasyon

- `package.json` scriptlerini (`lint`, `test`, `build`, `preview`) güncelle.
- GitHub Actions/benzeri pipeline ile lint + test + build aşamalarını koş.
- Storybook (varsa) deploy pipeline'ı oluştur, komponent kataloğunu güncel tut.
- `docs/frontend` altında mimari diyagram, bileşen envanteri ve admin kullanım kılavuzu tut.

## 10. Teslim Kriterleri

- Admin paneli fonksiyonel (login, listeleme, CRUD) ve responsive.
- Tüm testler ve kalite kontrolleri (ESLint, prettier, unit test) başarılı.
- Lighthouse skorları: Performance > 85, Accessibility > 90, Best Practices > 90.
- Kod yapısı hedef mimariye uyuyor, gereksiz dosya/komponent bırakılmamış.
- Güncel dokümantasyon ile yeni ekip üyesi projeye hızlı adaptasyon sağlayabiliyor.
