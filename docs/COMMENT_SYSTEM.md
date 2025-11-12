# Yorum Sistemi - Kullanım Kılavuzu

## 🎯 Özellikler

### Frontend (Kullanıcı Tarafı)

- ✅ Blog detay sayfalarında yorum yapma
- ✅ İnteraktif "Hadi sen de bir yorum bırak!" butonu
- ✅ Modern ve responsive yorum formu
- ✅ Onaylanmış yorumları görüntüleme
- ✅ Yanıt yorumları desteği (nested comments)
- ✅ Karakter sayacı (max 2000 karakter)
- ✅ Form validasyonu (email, isim, içerik)
- ✅ Başarı/hata mesajları

### Admin Paneli

- ✅ Tüm yorumları listeleme (pagination ile)
- ✅ Durum filtreleme (Beklemede/Onaylandı/Reddedildi/Spam)
- ✅ Yorumları onaylama (✓)
- ✅ Yorumları reddetme (✗)
- ✅ Spam olarak işaretleme (🚫)
- ✅ Yorum silme (🗑️) - Yanıt yorumları da silinir
- ✅ İstatistikler (Toplam/Beklemede/Onaylı/Reddedildi/Spam)
- ✅ Düzenleme tracking (isEdited badge)
- ✅ Mobile responsive tasarım

## 📁 Dosya Yapısı

### Backend

```
backend/src/modules/comment/
├── comment.module.js                           # Module initialization
├── domain/
│   └── Comment.js                              # Mongoose schema
├── infrastructure/
│   └── database/
│       └── CommentRepository.js                # Data access layer
├── application/
│   └── CommentService.js                       # Business logic
└── interfaces/
    └── http/
        └── CommentController.js                # HTTP endpoints
```

### Frontend

```
frontend/src/modules/
├── blog/
│   ├── components/
│   │   ├── CommentSection.jsx                  # Yorum bileşeni
│   │   └── CommentSection.css                  # Yorum stilleri
│   ├── services/
│   │   └── commentService.js                   # API client
│   └── pages/
│       └── BlogDetailPage.jsx                  # CommentSection entegrasyonu
└── admin/
    ├── pages/
    │   └── AdminCommentManagementPage.jsx      # Admin yönetim sayfası
    ├── services/
    │   └── commentService.js                   # Admin API client
    ├── components/
    │   └── AdminSidebar.jsx                    # "Yorumlar" menü öğesi
    └── routes/
        └── AdminRoutes.jsx                     # /admin/comments route
```

## 🔌 API Endpoints

### Public Routes (Kimlik Doğrulama Gerektirmez)

#### Onaylı Yorumları Getir

```
GET /api/comments/blog/:blogId
```

- Sadece onaylanmış yorumları döner
- Yanıt yorumlarını da içerir (nested)
- Pagination desteği (default: 20 item/sayfa)

#### Yeni Yorum Oluştur

```
POST /api/comments
```

Body:

```json
{
  "blogId": "blog-id",
  "author": {
    "name": "Ahmet Yılmaz",
    "email": "ahmet@example.com",
    "website": "https://example.com" // Opsiyonel
  },
  "content": "Harika bir yazı!"
}
```

- Durum otomatik "pending" olarak atanır
- IP adresi ve user-agent otomatik kaydedilir

### Admin Routes (Admin Kimlik Doğrulaması Gerektirir)

#### Tüm Yorumları Getir

```
GET /api/comments
Query params: page, limit, status, blogId, sort
```

#### İstatistikleri Getir

```
GET /api/comments/stats
```

#### Yorumu Onayla

```
PATCH /api/comments/:id/approve
```

#### Yorumu Reddet

```
PATCH /api/comments/:id/reject
```

#### Spam Olarak İşaretle

```
PATCH /api/comments/:id/spam
```

#### Yorumu Sil

```
DELETE /api/comments/:id
```

- Yanıt yorumları da cascade olarak silinir

#### Yorumu Güncelle

```
PUT /api/comments/:id
Body: { content, author, status }
```

## 🎨 Frontend Kullanımı

### Blog Sayfasında Yorum Bırakma

1. Kullanıcı blog detay sayfasına gider
2. "Hadi sen de bir yorum bırak!" butonuna tıklar
3. Form açılır (İsim, Email, Website, Yorum)
4. Formu doldurur ve "Yorumu Gönder" butonuna tıklar
5. Başarılı mesajı görür: "Yorumunuz başarıyla gönderildi! Onaylandıktan sonra görünecektir."
6. Yorum "pending" durumunda admin paneline düşer

### Admin Panelinde Yorum Yönetimi

1. Admin panele giriş yap
2. Sol menüden "Yorumlar" sekmesine tıkla
3. Tüm yorumlar listelenir (pagination ile)
4. Durum filtresinden istediğin durumu seç:

   - Tümü
   - Beklemede
   - Onaylandı
   - Reddedildi
   - Spam

5. Yorum aksiyonları:
   - **✓ Onayla**: Yorumu "approved" yap → Blog sayfasında görünür
   - **✗ Reddet**: Yorumu "rejected" yap
   - **🚫 Spam**: Yorumu "spam" olarak işaretle
   - **🗑️ Sil**: Yorumu kalıcı olarak sil (yanıt yorumları da silinir)

## 💾 Database Schema

```javascript
{
  blogId: ObjectId,           // Blog referansı
  author: {
    name: String,             // Zorunlu
    email: String,            // Zorunlu, email formatı
    website: String           // Opsiyonel, URL formatı
  },
  content: String,            // Max 2000 karakter
  parentId: ObjectId,         // Yanıt yorumu için
  status: String,             // pending/approved/rejected/spam
  likes: Number,              // Default: 0
  isEdited: Boolean,          // Düzenlendi mi?
  editedAt: Date,             // Düzenlenme tarihi
  ipAddress: String,          // Otomatik kaydedilir
  userAgent: String,          // Otomatik kaydedilir
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Güvenlik

- ✅ Email validasyonu (regex)
- ✅ Content uzunluk kontrolü (max 2000)
- ✅ Admin route'ları JWT ile korunur
- ✅ IP adresi ve user-agent tracking
- ✅ XSS koruması için HTML encode
- ✅ Rate limiting (opsiyonel)

## 🎯 Durum Workflow

```
[Kullanıcı Yorum Yazar]
        ↓
    "pending"
        ↓
  [Admin Kontrol]
    ↙   ↓   ↘
approved rejected spam
    ↓
[Blog'da Görünür]
```

## 🚀 Deployment Notları

### Environment Variables

Backend'e eklenmesi gereken env var yok. MongoDB bağlantısı mevcut.

### Migration

Yeni collection: `comments`

- Otomatik oluşturulur (Mongoose)
- İndeksler otomatik uygulanır:
  - `{blogId, status, createdAt}`
  - `{status, createdAt}`

## 📱 Responsive Breakpoints

- **≥960px**: Full layout
- **768px**: Bazı tablo kolonları gizlenir
- **640px**: Form grid 1 kolona düşer
- **480px**: Compact layout
- **375px**: Mobile optimize

## 🎨 CSS Custom Properties

Yorum sistemi mevcut tema değişkenlerini kullanır:

- `--color-primary`: Ana renk
- `--color-accent`: Vurgu rengi
- `--color-background`: Arka plan
- `--color-surface`: Kart arka planı
- `--color-line`: Kenarlık rengi
- `--color-text`: Metin rengi
- `--color-text-muted`: Soluk metin

## ✨ Özellikler

### Animation

- Bounce animasyonu (💬 icon)
- Fade in (modal)
- Slide up (form)
- Transform on hover

### Accessibility

- ARIA labels
- Semantic HTML
- Keyboard navigation
- Screen reader support

## 🧪 Test Senaryosu

1. **Yorum Oluşturma**:

   - Blog sayfasına git
   - Yorum butonuna tıkla
   - Formu doldur
   - Gönder

2. **Admin Onaylama**:

   - Admin panele gir
   - Yorumlar sekmesine git
   - "Beklemede" filtrele
   - Yorumu onayla (✓)

3. **Blog'da Görüntüleme**:

   - Blog sayfasını yenile
   - Onaylanan yorum görünür

4. **Silme**:
   - Admin panelde yorumu bul
   - Sil butonuna tıkla (🗑️)
   - Onay ver
   - Yorum ve yanıtları silinir

## 🎉 Sonuç

Yorum sistemi tamamen çalışır durumda! Kullanıcılar blog yazılarına yorum yapabilir, admin panelden yönetebilirsiniz. Tüm yorumlar moderasyondan geçer (pending → approved workflow).
