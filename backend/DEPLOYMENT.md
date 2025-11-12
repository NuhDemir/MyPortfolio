# Backend Deployment Rehberi

## 🚀 Render.com ile Deployment (ÖNERİLEN)

### Ön Hazırlık

#### 1. MongoDB Atlas Kurulumu (ÜCRETSİZ)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) hesabı oluştur
2. "Build a Database" → "M0 FREE" seç
3. Cloud Provider: AWS, Region: Yakın bir bölge seç (Frankfurt)
4. Cluster Name: `MyPortfolio`
5. Database User oluştur:
   - Username: `portfolioadmin`
   - Password: Güçlü bir şifre (kaydet!)
6. Network Access:
   - "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)
7. "Connect" → "Connect your application"
   - Driver: Node.js
   - Connection string'i kopyala:
     ```
     mongodb+srv://portfolioadmin:<password>@myportfolio.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - `<password>` yerine şifrenizi yazın

#### 2. Cloudinary Kurulumu (ÜCRETSİZ)

1. [Cloudinary](https://cloudinary.com/users/register/free) hesabı oluştur
2. Dashboard'da şunları kopyala:
   - Cloud Name
   - API Key
   - API Secret

### Render.com Deployment

#### 1. Render Hesabı

1. [render.com](https://render.com) → "Get Started for Free"
2. GitHub ile giriş yap
3. GitHub Education'dan Render kredini aktifleştir ($200/yıl):
   - [GitHub Student Pack](https://education.github.com/pack)
   - Render'ı bul ve "Get access" tıkla

#### 2. Web Service Oluştur

1. Render Dashboard → "New +" → "Web Service"
2. GitHub repository'nizi bağlayın (NuhDemir/MyPortfolio)
3. Ayarlar:
   - **Name:** `myportfolio-backend`
   - **Region:** Oregon (ücretsiz) veya Frankfurt (ücretli ama yakın)
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (başlangıç için)

#### 3. Environment Variables Ekle

"Advanced" → "Add Environment Variable":

```env
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://portfolioadmin:YOURPASSWORD@myportfolio.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_REFRESH_SECRET=super-secret-refresh-token-key-min-32-chars
JWT_EXPIRES_IN=24h
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CORS_ALLOWED_ORIGINS=https://nuhdemir.dev
FRONTEND_URL=https://nuhdemir.dev
```

⚠️ **ÖNEMLİ:**

- `JWT_SECRET`: Güçlü, rastgele, en az 32 karakter
- `MONGODB_URI`: MongoDB Atlas connection string'inizi yazın
- `CORS_ALLOWED_ORIGINS`: Production client URL - **https://nuhdemir.dev**
- `FRONTEND_URL`: Production frontend URL - **https://nuhdemir.dev**

#### 4. Deploy!

1. "Create Web Service" butonuna tıkla
2. İlk deploy 2-3 dakika sürer
3. Deploy loglarını izleyin
4. URL'niz hazır: `https://myportfolio-backend.onrender.com`

#### 5. Test Et

```bash
curl https://myportfolio-backend.onrender.com/api/health
```

### Frontend'i Bağlama

Frontend'inizde API base URL'i güncelleyin:

```javascript
const API_URL = "https://myportfolio-backend.onrender.com/api";
```

---

## 🚂 Railway.app Alternatifi

### 1. Railway Hesabı

1. [railway.app](https://railway.app) → GitHub ile giriş
2. GitHub Student Pack'ten $20/ay kredi al

### 2. Deploy

1. "New Project" → "Deploy from GitHub repo"
2. Repository seç → `MyPortfolio`
3. "Add Service" → "GitHub Repo" → backend klasörünü belirt
4. Root Directory: `/backend`
5. Environment Variables ekle (yukarıdaki gibi)
6. Otomatik deploy başlar

### 3. Database (Opsiyonel - Railway'de)

1. "New" → "Database" → "Add MongoDB"
2. Otomatik connection string oluşturulur
3. `MONGODB_URI` environment variable'ına ekle

---

## 📱 DigitalOcean App Platform

### 1. Hesap

1. [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. GitHub Education'dan $200 kredi al

### 2. App Oluştur

1. "Create" → "Apps"
2. GitHub'dan repository seç
3. Source Directory: `backend`
4. Build Command: `npm install`
5. Run Command: `npm start`
6. Environment Variables ekle
7. $5/ay Basic plan seç (krediden düşer)

---

## 🔧 Deployment Sonrası

### Health Check

Backend'inizde health endpoint var mı kontrol edin:

```bash
GET /api/health
```

Yoksa ekleyin!

### CORS Ayarları

Backend'de CORS'u production URL'inize göre ayarlayın.

### Admin User Oluştur

Deploy sonrası ilk admin user'ı oluşturun:

```bash
# Render Shell'den veya Railway terminal'den
npm run create-admin
```

### SSL/HTTPS

Render ve Railway otomatik SSL sertifikası sağlar ✅

### Monitoring

- Render: Otomatik logs ve metrics
- Railway: Dashboard'da monitoring
- Ücretsiz: [UptimeRobot](https://uptimerobot.com) ile uptime monitoring

---

## 🆘 Sorun Giderme

### Port Hatası

Render `PORT` environment variable'ını otomatik set eder. Kodunuzda:

```javascript
const PORT = process.env.PORT || 3000;
```

### Database Connection Hatası

- MongoDB Atlas'ta IP whitelist kontrol edin (0.0.0.0/0 olmalı)
- Connection string'de şifre doğru mu?
- Database user yetkisi var mı?

### Build Hatası

- `package.json` doğru mu?
- Node version uyumlu mu? (`.node-version` dosyası ekleyin)
- Dependencies eksik mi?

### Memory Hatası

Free tier'da 512MB RAM var. Optimize edin veya paid plan alın.

---

## 💰 Maliyet Karşılaştırması

| Platform          | Ücretsiz       | Student Pack Kredisi | Limit                  |
| ----------------- | -------------- | -------------------- | ---------------------- |
| **Render**        | ✅ 750 saat/ay | $200/yıl             | Free tier yavaş başlar |
| **Railway**       | ❌             | $20/ay (1 yıl)       | $5 kullanım sonrası    |
| **DigitalOcean**  | ❌             | $200/yıl             | $5/ay başlar           |
| **MongoDB Atlas** | ✅ M0 512MB    | -                    | Sınırsız               |
| **Cloudinary**    | ✅ 25GB        | -                    | Yeter                  |

### ÖNERİM

1. **MongoDB Atlas** (ücretsiz tier) → Database
2. **Render** (ücretsiz + $200 kredi) → Backend
3. **Vercel/Netlify** (ücretsiz) → Frontend

---

## ✅ Checklist

- [ ] MongoDB Atlas database oluşturuldu
- [ ] Cloudinary hesabı hazır
- [ ] Render hesabı oluşturuldu
- [ ] GitHub Student Pack aktif
- [ ] Repository Render'a bağlandı
- [ ] Environment variables eklendi
- [ ] İlk deploy başarılı
- [ ] Health endpoint çalışıyor
- [ ] Admin user oluşturuldu
- [ ] Frontend'e API URL eklendi
- [ ] CORS ayarları yapıldı

---

## 🎓 GitHub Student Pack Nasıl Alınır?

1. [education.github.com/pack](https://education.github.com/pack) adresine git
2. "Get the Student Pack" → Öğrenci mailini doğrula
3. Öğrenci belgesi yükle (öğrenci kimliği veya transkript)
4. Onaylanınca (1-2 gün) tüm benefitlere eriş:
   - Render: $200/yıl
   - Railway: $20/ay
   - DigitalOcean: $200/yıl
   - Heroku: Kredi
   - ve 100+ araç daha!

Başarılar! 🚀
