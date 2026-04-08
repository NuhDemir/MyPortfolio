# 🚀 Production Deployment Checklist

## Backend: MyPortfolio

**Production Client URL:** https://nuhdemir.dev

---

## ✅ Ön Hazırlık (Tamamlanması Gerekenler)

### 1. External Services

#### MongoDB Atlas

- [ ] Hesap oluşturuldu: https://mongodb.com/cloud/atlas
- [ ] M0 FREE Cluster oluşturuldu
- [ ] Database adı: `portfolio`
- [ ] Database user oluşturuldu
- [ ] Network Access: `0.0.0.0/0` (Allow from anywhere)
- [ ] Connection string alındı
- [ ] Connection string test edildi

**Connection String Format:**

```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
```

#### Cloudinary

- [ ] Hesap oluşturuldu: https://cloudinary.com
- [ ] Dashboard'dan bilgiler alındı:
  - Cloud Name: `your_cloud_name`
  - API Key: `your_api_key`
  - API Secret: `your_api_secret`

#### GitHub Student Pack

- [ ] Student Pack aktif: https://education.github.com/pack
- [ ] Render.com kredisi alındı ($200/yıl)
- [ ] Railway.app kredisi alındı ($20/ay - opsiyonel)
- [ ] DigitalOcean kredisi alındı ($200/yıl - opsiyonel)

---

## 🔐 Environment Variables (Production)

### Render.com Dashboard'a Eklenecekler:

```env
# Database
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority

# JWT - ⚠️ ÖNEMLİ: Production'da MUTLAKA değiştirin!
JWT_SECRET=BURAYA-EN-AZ-32-KARAKTER-GUCLU-RASTGELE-ANAHTAR-YAZIN
JWT_REFRESH_SECRET=BURAYA-EN-AZ-32-KARAKTER-GUCLU-RASTGELE-REFRESH-ANAHTAR
JWT_EXPIRES_IN=24h

# Cloudinary (Mevcut değerleriniz)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
NODE_ENV=production
PORT=10000

# CORS & Frontend
CORS_ALLOWED_ORIGINS=https://nuhdemir.dev
FRONTEND_URL=https://nuhdemir.dev
```

### ⚠️ GÜÇLÜ JWT SECRET ÜRETİMİ

**Opsiyonel Yöntemler:**

1. **Node.js ile:**

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Online (güvenli):**
   - https://randomkeygen.com/ (CodeIgniter Encryption Keys)

3. **Manuel:**
   - En az 32 karakter
   - Büyük/küçük harf, sayı, özel karakter
   - Örnek: `Kf8#mP9$nQ2@rS5&tU7*vW1!xY3%zA6^`

---

## 📦 Render.com Deployment

### Adım 1: Web Service Oluştur

- [ ] https://render.com → Dashboard
- [ ] "New +" → "Web Service"
- [ ] GitHub repository bağla: `NuhDemir/MyPortfolio`
- [ ] Ayarlar:
  - **Name:** `myportfolio-backend` (veya istediğiniz isim)
  - **Region:** Oregon (Free) veya Frankfurt (Ücretli ama yakın)
  - **Branch:** `main`
  - **Root Directory:** `backend`
  - **Environment:** Node
  - **Build Command:** `npm install`
  - **Start Command:** `npm start`
  - **Instance Type:** Free (başlangıç için)

### Adım 2: Environment Variables Ekle

- [ ] "Advanced" → "Add Environment Variable"
- [ ] Yukarıdaki tüm environment variables'ları ekle
- [ ] **ÖNEMLİ:** JWT_SECRET'ı değiştir!

### Adım 3: Deploy

- [ ] "Create Web Service" butonuna tıkla
- [ ] İlk deploy başladı (2-5 dakika sürer)
- [ ] Deploy loglarını izle
- [ ] Deploy başarılı oldu ✅

### Adım 4: URL'yi Kaydet

**Backend URL:** `https://myportfolio-backend.onrender.com` (veya size verilen URL)

- [ ] URL'yi not aldım
- [ ] URL'yi frontend'de kullanacağım

---

## 🧪 Deployment Sonrası Test

### 1. Health Check

```bash
curl https://YOUR-BACKEND-URL.onrender.com/api/health
```

**Beklenen Sonuç:**

```json
{
  "status": "ok",
  "timestamp": "2025-11-12T...",
  "uptime": 123.45,
  "environment": "production"
}
```

- [ ] Health endpoint çalışıyor ✅

### 2. Database Bağlantısı

```bash
# Render Dashboard → Logs
# "Connected to MongoDB" mesajını ara
```

- [ ] MongoDB bağlantısı başarılı ✅

### 3. API Endpoints Test

```bash
# Auth endpoint test
curl https://YOUR-BACKEND-URL.onrender.com/api/auth/login

# Blog endpoint test
curl https://YOUR-BACKEND-URL.onrender.com/api/blog

# Projects endpoint test
curl https://YOUR-BACKEND-URL.onrender.com/api/projects
```

- [ ] Tüm endpoints çalışıyor ✅

### 4. CORS Test

```bash
# Frontend'den (https://nuhdemir.dev) API call yapmayı test et
```

- [ ] CORS doğru çalışıyor ✅
- [ ] Frontend'den API'ye erişim var ✅

---

## 🔧 Production Optimizasyonları

### Render.com Ayarları

- [ ] Auto-Deploy açık (GitHub push'ta otomatik deploy)
- [ ] Health Check Path: `/api/health`
- [ ] Notifications aktif (deploy başarısız olursa email)

### Backend Keep-Alive (Önemli!)

Render.com ücretsiz planında backend 15 dakika inaktif kalırsa uyku moduna girer.

**✅ Frontend'de otomatik ping sistemi kuruldu!**

- [x] `useBackendKeepAlive` hook'u oluşturuldu
- [x] App.jsx'de her 10 dakikada bir otomatik ping
- [x] Health endpoint'e otomatik ping atılıyor
- [ ] Frontend deploy sonrası ping loglarını console'da kontrol et

**Console'da göreceğiniz:**

```
🔄 Backend keep-alive started: Ping every 10 minutes
✅ Backend ping successful: { status: 'ok', timestamp: '...', uptime: '123 minutes' }
```

**Manuel Monitoring (Opsiyonel):**

- [ ] UptimeRobot kuruldu: https://uptimerobot.com
- Check URL: `https://YOUR-BACKEND-URL.onrender.com/api/health`
- Interval: Her 5 dakika

### Database

- [ ] MongoDB Atlas'ta index'ler oluşturuldu
- [ ] Database backup otomatik (Atlas ücretsizde var)

### Monitoring

- [ ] Render Dashboard'da logs takip ediliyor
- [ ] UptimeRobot veya benzeri uptime monitoring kuruldu (opsiyonel)
  - https://uptimerobot.com (ücretsiz)
  - Check URL: `https://YOUR-BACKEND-URL.onrender.com/api/health`

---

## 🎯 Frontend Entegrasyonu

### Frontend'de Yapılacaklar:

1. **API Base URL Güncelle**

   ```javascript
   // Frontend: src/core/http/axiosClient.js veya config
   const API_URL = "https://YOUR-BACKEND-URL.onrender.com/api";
   ```

2. **Environment Variables (Frontend)**
   ```env
   VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com/api
   ```

- [ ] Frontend'de API URL güncellendi
- [ ] Frontend test edildi
- [ ] Frontend - Backend iletişimi çalışıyor ✅

---

## 🆘 Sorun Giderme

### Build Hatası

- [ ] `package.json` doğru mu kontrol edildi
- [ ] Node version uyumlu mu (`.node-version` = 20)
- [ ] Build logs kontrol edildi

### Database Connection Hatası

- [ ] MongoDB Atlas IP whitelist `0.0.0.0/0` mu?
- [ ] Connection string doğru mu?
- [ ] Database user şifresi doğru mu?
- [ ] Database name var mı? (`/portfolio`)

### CORS Hatası

- [ ] `CORS_ALLOWED_ORIGINS` doğru mu? (`https://nuhdemir.dev`)
- [ ] Frontend URL'i doğru mu?
- [ ] Browser console'da hata mesajı kontrol edildi

### Memory/Performance

- [ ] Free tier limitler: 512MB RAM, CPU throttling
- [ ] Gerekirse Starter plan'a upgrade ($7/ay)

---

## 📊 Deployment Özeti

### Kullanılan Servisler

| Servis            | Plan           | Maliyet | URL                           |
| ----------------- | -------------- | ------- | ----------------------------- |
| **Render.com**    | Free + Student | $0      | https://YOUR-URL.onrender.com |
| **MongoDB Atlas** | M0 Free        | $0      | -                             |
| **Cloudinary**    | Free Tier      | $0      | -                             |
| **Frontend**      | -              | -       | https://nuhdemir.dev          |

**Toplam Maliyet:** $0/ay 🎉

### Student Pack Kredileri

- Render: $200/yıl kullanılabilir
- Toplam tasarruf: ~$200/yıl

---

## ✅ Final Checklist

- [ ] Backend başarıyla deploy edildi
- [ ] Tüm environment variables eklendi
- [ ] Health endpoint çalışıyor
- [ ] Database bağlantısı aktif
- [ ] CORS ayarları doğru
- [ ] Frontend - Backend iletişimi çalışıyor
- [ ] SSL/HTTPS aktif (Render otomatik)
- [ ] Monitoring kuruldu
- [ ] Admin user oluşturuldu (gerekirse)
- [ ] Logs düzenli kontrol ediliyor

---

## 🎓 Notlar

### Render Free Tier Limitler

- 750 saat/ay (bir uygulama için yeterli)
- İlk istekte 30-60 saniye "cold start" olabilir (uyuma durumundan çıkış)
- 512MB RAM
- CPU throttling

### Performance İyileştirme

Eğer cold start sorun olursa:

1. UptimeRobot ile her 10 dakikada ping at (uyanık tut)
2. Starter plan'a geç ($7/ay - Student Pack'ten düşer)

### Güvenlik

- ✅ Environment variables güvenli (Render'da şifreli)
- ✅ HTTPS otomatik
- ✅ Rate limiting aktif
- ✅ Helmet.js güvenlik header'ları aktif
- ⚠️ JWT secrets production'da değiştirildi mi?

---

## 🚀 Başarılar!

Backend deployment'ınız hazır!

**Backend URL:** `https://YOUR-BACKEND-URL.onrender.com`  
**Frontend URL:** `https://nuhdemir.dev`

Herhangi bir sorun olursa:

1. Render Dashboard → Logs kontrol et
2. `DEPLOYMENT.md` dosyasına bak
3. `QUICK_DEPLOY.md` rehberini oku

**Deployment tarihi:** ******\_\_\_******  
**Deploy eden:** Nuh Demir
