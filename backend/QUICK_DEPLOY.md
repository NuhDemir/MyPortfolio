# 🚀 Hızlı Deployment Rehberi

Backend'inizi GitHub Student Pack ile ücretsiz deploy etmek için **3 kolay seçenek**:

## ⭐ 1. Render.com (ÖNERİLEN - EN KOLAY)

### Neden Render?

✅ Tamamen ücretsiz tier  
✅ GitHub Student Pack ile $200/yıl kredi  
✅ Otomatik SSL  
✅ 1 tıkla deploy  
✅ Otomatik GitHub sync

### Hızlı Başlangıç

1. **MongoDB Atlas (Database)**
   - https://mongodb.com/cloud/atlas → Ücretsiz hesap
   - M0 FREE Cluster oluştur
   - Connection string'i kopyala

2. **Render Hesabı**
   - https://render.com → GitHub ile giriş
   - GitHub Student Pack'ten kredi al

3. **Deploy**

   ```
   Render Dashboard → "New +" → "Web Service"
   → GitHub repo bağla (MyPortfolio)
   → Root Directory: backend
   → Build: npm install
   → Start: npm start
   → Environment variables ekle (.env.example'a bak)
   → Deploy!
   ```

4. **Environment Variables Ekle**

   ```env
   NODE_ENV=production
   PORT=10000
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=en-az-32-karakter-guclu-rastgele-anahtar
   JWT_REFRESH_SECRET=en-az-32-karakter-guclu-rastgele-anahtar
   JWT_EXPIRES_IN=24h
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   CORS_ALLOWED_ORIGINS=https://nuhdemir.dev
   FRONTEND_URL=https://nuhdemir.dev
   ```

5. **5 dakika içinde hazır!** 🎉
   - URL: `https://myportfolio-backend.onrender.com`
   - Test: `curl https://myportfolio-backend.onrender.com/api/health`

6. **Backend Keep-Alive Sistemi** 🔄
   - ✅ Frontend'de otomatik ping sistemi kuruldu
   - Her 10 dakikada bir backend'e ping atılır
   - Render'ın 15 dakika uyuma sorunu çözüldü
   - Kullanıcılar sitedeyken backend her zaman uyanık!

---

## 🚂 2. Railway.app (HIZLI & MODERN)

### Neden Railway?

✅ GitHub Student Pack ile $20/ay (1 yıl)  
✅ Çok hızlı deployment  
✅ Built-in MongoDB  
✅ Modern dashboard

### Hızlı Başlangıç

1. https://railway.app → GitHub ile giriş
2. Student Pack kredisini aktifleştir
3. "New Project" → "Deploy from GitHub repo"
4. Repository seç → `backend` klasörünü belirt
5. Add MongoDB service (opsiyonel)
6. Environment variables ekle
7. Deploy! 🚀

**Süre:** 3-5 dakika

---

## 🌊 3. DigitalOcean App Platform

### Neden DO?

✅ Student Pack ile $200/yıl kredi  
✅ Profesyonel platform  
✅ Güçlü performans

### Hızlı Başlangıç

1. https://cloud.digitalocean.com → Hesap oluştur
2. Student Pack kredisi al
3. "Create" → "Apps" → GitHub repo seç
4. `backend` klasörünü belirt
5. Environment variables ekle
6. $5/ay plan seç (krediden düşer)
7. Deploy!

**Süre:** 5-8 dakika

---

## 📋 Deployment Checklist

Deployment öncesi kontrol listesi:

- [ ] MongoDB Atlas hesabı oluşturuldu (ücretsiz M0)
- [ ] Cloudinary hesabı hazır
- [ ] GitHub Student Pack alındı
- [ ] `.env.example` dosyası kontrol edildi
- [ ] `package.json` scripts doğru (`start`, `build`)
- [ ] Git'e push yapıldı
- [ ] Environment variables hazır
- [ ] CORS ayarları yapıldı

Deployment sonrası:

- [ ] Health endpoint test edildi: `/api/health`
- [ ] Database bağlantısı çalışıyor
- [ ] API endpoints test edildi
- [ ] HTTPS aktif (otomatik)
- [ ] Logs kontrol edildi
- [ ] Frontend'e backend URL'i eklendi

---

## 🆘 Sık Sorunlar ve Çözümleri

### Build Başarısız

```bash
# package.json'da start script var mı?
"scripts": {
  "start": "node server.js"
}

# Node version doğru mu? (.node-version dosyası)
20
```

### Database Bağlanamıyor

- MongoDB Atlas'ta IP whitelist: `0.0.0.0/0` olmalı
- Connection string'de şifre doğru mu?
- Database name var mı? (`...mongodb.net/portfolio?...`)

### Port Hatası

```javascript
// server.js'de
const PORT = process.env.PORT || 3000;
app.listen(PORT);
```

### CORS Hatası

```javascript
// CORS_ALLOWED_ORIGINS environment variable'da frontend URL
app.use(
  cors({
    origin: process.env.CORS_ALLOWED_ORIGINS.split(","),
  })
);
```

---

## 💡 İpuçları

1. **Başlangıç için Render** kullanın - en kolay ve ücretsiz
2. **MongoDB Atlas** M0 tier tamamen yeterli
3. **Cloudinary** ücretsiz tier 25GB - gayet iyi
4. **Student Pack** şart - $200-400 değerinde kredi
5. **Environment variables** asla Git'e push etmeyin
6. **Health endpoint** monitoring için önemli
7. **Logs** düzenli kontrol edin
8. **Auto-deploy** açın - her push otomatik deploy

---

## 📚 Detaylı Dökümantasyon

Tüm detaylar için: `DEPLOYMENT.md`

---

## 🎓 GitHub Student Pack Nasıl Alınır?

1. https://education.github.com/pack
2. Öğrenci mailinle kaydol (.edu uzantılı)
3. Öğrenci belgesi yükle (kimlik veya transkript)
4. 1-2 gün içinde onaylanır
5. 100+ ücretsiz araç ve kredi!

**Faydalar:**

- Render: $200/yıl
- Railway: $20/ay (12 ay)
- DigitalOcean: $200/yıl
- Heroku: Kredi
- Domain: Ücretsiz .me domain
- ve daha fazlası!

---

## 🚀 Şimdi Deploy Et!

Render ile 5 dakikada:

1. https://render.com → Giriş yap
2. "New Web Service" → GitHub'dan backend'i seç
3. Environment variables ekle
4. Deploy!

**Başarılar!** 🎉

Sorular için: `DEPLOYMENT.md` dosyasına bakın.
