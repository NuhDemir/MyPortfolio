# Backend–Frontend Entegrasyon Görev Planı

## Amaç

Backend API'sini katmanlı frontend mimarisiyle entegre ederek uçtan uca tutarlı bir kullanıcı deneyimi sağlamak.

## Ön Hazırlık

- [ ] `backend/.env` ve `frontend/.env` dosyalarındaki API URL, PORT ve gizli anahtarları güncelleyin.
- [ ] Backend'i çalıştırın, gerekli migration/tohumlama adımlarını tamamlayın.
- [ ] Frontend ve backend bağımlılıklarını senkronize edin (`npm install`).

## Görev Listesi

- [x] **Fix the remaining stylesheet import paths**: Katmanlı mimari sonrası bozulmuş CSS/SCSS importlarını `src/modules/**` içindeki yeni konumlarına göre düzeltin ve `npm run dev` ile doğrulayın.
- [x] **API taban URL'sini hizalayın**: `frontend/src/core/http/axiosClient.js` dosyasında backend adresini `.env` üzerinden okunacak şekilde yapılandırın.
- [x] **Auth servislerini güncelleyin**: `frontend/src/modules/admin/services/authService.js` (ve varsa diğer auth servisleri) içinde login/register/logout çağrılarını backend endpoint'leriyle eşleştirin.
- [x] **Blog ve proje servislerini senkronize edin**: `frontend/src/modules/blog/services/blogService.js` ve `frontend/src/modules/projects/services/projectService.js` içinde CRUD işlemlerini backend rotalarına yönlendirin.
- [x] **Kullanıcı rolü yönetimi**: `frontend/src/core/context/UserRoleContext.jsx` değerlerini backend'den gelen token/rol bilgisiyle hizalayın; backend tarafında JWT doğrulama middleware'ini aktifleştirin.
- [x] **CORS ve geliştirici proxy ayarları**: Backend CORS konfigürasyonunu frontend portuna izin verecek şekilde düzenleyin; gerekirse `vite.config.js` içinde proxy tanımlayın.
- [x] **Yükleme ve hata durumlarını standardize edin**: `frontend/src/shared/ui/LoadingSpinner.jsx` ve `frontend/src/shared/ui/ErrorMessage.jsx` bileşenlerini backend yanıt sözleşmeleriyle uyumlu hale getirin.

## Doğrulama

- [ ] Backend sağlık kontrolü (`/health` vb.) sorunsuz yanıt veriyor.
- [ ] Frontend başlangıç yüklemesinde konsol hatası bulunmuyor.
- [ ] Auth, blog ve proje akışları manuel test edildi.
- [ ] Frontend ve backend test komutları (ör. `npm run test`) sorunsuz çalışıyor.

## Tamamlandıktan Sonra

- [ ] Yapılan değişiklikleri ilgili `README.md` dosyalarına not edin.
- [ ] Dağıtım ortamları için gerekli `.env.production` benzeri dosyaları oluşturun.
