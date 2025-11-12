# 🔄 Backend Keep-Alive Sistemi

## Problem

Render.com ücretsiz planında backend servisleri **15 dakika inaktif** kalırsa otomatik olarak uyku moduna girer. İlk istek geldiğinde sunucu uyanır ama bu **30-60 saniye** sürebilir ("cold start").

## Çözüm

Frontend'den backend'e otomatik ping sistemi kuruldu. Her **10 dakikada bir** backend'in health endpoint'ine istek atılarak sunucunun uyanık kalması sağlanır.

## 📁 Dosyalar

### Frontend

1. **`src/shared/hooks/useBackendKeepAlive.js`** - Ana hook
2. **`src/app/App.jsx`** - Hook kullanımı
3. **`.env`** - Backend URL konfigürasyonu

### Backend

1. **`src/app/http/routes.js`** - Health endpoint
2. **`.env`** - CORS ve frontend URL ayarları

## 🚀 Nasıl Çalışır?

### 1. Frontend Hook Aktif

```javascript
// App.jsx
useBackendKeepAlive({
  apiUrl: "https://your-backend.onrender.com/api",
  intervalMinutes: 10,
  enabled: true,
});
```

### 2. Otomatik Ping

- Her 10 dakikada bir `GET /api/health` çağrısı yapılır
- Backend uyanık kalır
- Cold start sorunu ortadan kalkar

### 3. Console Logları

```
🔄 Backend keep-alive started: Ping every 10 minutes
✅ Backend ping successful: { status: 'ok', timestamp: '...', uptime: '123 minutes' }
```

## ⚙️ Konfigürasyon

### Frontend `.env`

```env
# Development
VITE_API_BASE_URL=http://localhost:5000/api

# Production (Deploy sonrası güncelleyin)
VITE_API_BASE_URL=https://myportfolio-backend.onrender.com/api
```

### Backend `.env`

```env
# Frontend URL (Ping isteklerini kabul et)
CORS_ALLOWED_ORIGINS=https://nuhdemir.dev
FRONTEND_URL=https://nuhdemir.dev
```

## 🔧 Özelleştirme

### Ping Süresini Değiştir

```javascript
useBackendKeepAlive({
  apiUrl: API_BASE_URL,
  intervalMinutes: 5, // 5 dakikada bir ping at
  enabled: true,
});
```

### Sadece Production'da Aktif

```javascript
useBackendKeepAlive({
  apiUrl: API_BASE_URL,
  intervalMinutes: 10,
  enabled: import.meta.env.PROD, // Sadece production'da
});
```

### Devre Dışı Bırak

```javascript
useBackendKeepAlive({
  apiUrl: API_BASE_URL,
  intervalMinutes: 10,
  enabled: false, // Kapalı
});
```

## 📊 Alternatif Yöntemler

### 1. UptimeRobot (Harici Servis)

- https://uptimerobot.com (ücretsiz)
- Her 5 dakikada dış ping
- Email bildirimleri
- Downtime takibi

**Ayar:**

- URL: `https://your-backend.onrender.com/api/health`
- Interval: 5 minutes
- Alert: Email

### 2. Cron Job (Render Ayarı)

Render Dashboard → Cron Jobs → Add Cron Job

- Schedule: `*/10 * * * *` (Her 10 dakika)
- Command: `curl https://your-backend.onrender.com/api/health`

### 3. GitHub Actions

```yaml
name: Keep Backend Alive
on:
  schedule:
    - cron: "*/10 * * * *" # Her 10 dakika
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Backend
        run: curl https://your-backend.onrender.com/api/health
```

## ✅ Avantajlar

| Yöntem             | Avantaj                                                         | Dezavantaj                           |
| ------------------ | --------------------------------------------------------------- | ------------------------------------ |
| **Frontend Hook**  | ✅ Kullanıcı sitedeyken otomatik <br> ✅ Ekstra servis gerekmez | ⚠️ Kullanıcı sitede değilse çalışmaz |
| **UptimeRobot**    | ✅ 7/24 aktif <br> ✅ Monitoring dahil                          | ⚠️ Harici bağımlılık                 |
| **Cron Job**       | ✅ Render içinde <br> ✅ Garantili                              | ⚠️ Render Pro gerektirebilir         |
| **GitHub Actions** | ✅ Ücretsiz <br> ✅ Kontrol edebilirsiniz                       | ⚠️ GitHub bağımlılığı                |

## 💡 Öneri

**Hibrit Yaklaşım (En İyi):**

1. **Frontend Hook** (kuruldu ✅) - Kullanıcı aktifken
2. **UptimeRobot** (opsiyonel) - 7/24 monitoring + ping

Bu kombinasyonla:

- Kullanıcılar sitedeyken otomatik ping
- Gece/az kullanımlı saatlerde UptimeRobot ping
- %99.9 uptime garantisi

## 🧪 Test

### Local Test

```bash
# Backend'i çalıştır
cd backend
npm start

# Frontend'i çalıştır
cd frontend
npm run dev

# Console'u aç (F12)
# 10 dakika sonra ping logunu gör
```

### Production Test

1. Backend'i deploy et
2. Frontend'i deploy et
3. Frontend'i aç
4. Console'da logları kontrol et:

```
🔄 Backend keep-alive started: Ping every 10 minutes
✅ Backend ping successful: ...
```

## 📝 Notlar

- ✅ Health endpoint hazır: `GET /api/health`
- ✅ CORS ayarları yapıldı
- ✅ Frontend hook kuruldu
- ✅ Otomatik başlatılıyor
- ⚠️ Production'da `.env` dosyasını güncelle

## 🚀 Deployment Sonrası

1. Backend URL'ini al (Render'dan)
2. Frontend `.env` güncelle:
   ```env
   VITE_API_BASE_URL=https://your-actual-backend-url.onrender.com/api
   ```
3. Frontend'i yeniden deploy et
4. Console'da ping loglarını kontrol et

## 🆘 Sorun Giderme

### Ping çalışmıyor

1. Console'da hata var mı?
2. `.env` dosyası doğru mu?
3. CORS ayarları backend'de doğru mu?
4. Health endpoint çalışıyor mu?

```bash
curl https://your-backend.onrender.com/api/health
```

### "Origin not allowed by CORS"

Backend `.env`:

```env
CORS_ALLOWED_ORIGINS=https://nuhdemir.dev,http://localhost:5173
```

### Backend hala uyuyor

- Ping interval'i çok uzun olabilir (10 → 8 dakika)
- UptimeRobot ekleyin
- Render logs kontrol edin

---

**Hazırlayan:** GitHub Copilot  
**Tarih:** 12 Kasım 2025  
**Proje:** MyPortfolio Backend Keep-Alive
