# MongoDB Model Oluşturma Rehberi

## Giriş: MongoDB Nedir ve Neden0,000 Model Kullanırız?

MongoDB, NoSQL (ilişkisel olmayan) bir veritabanıdır. Verilerimizi JSON benzeri belgeler (documents) halinde saklar. Mongoose ise MongoDB ile Node.js arasında köprü görevi gören bir ODM (Object Document Mapper) kütüphanesidir.

**Model nedir?** Model, veritabanındaki verilerimizin yapısını, kurallarını ve davranışlarını tanımlayan şablondur. Tıpkı bir ev planı gibi - evin nasıl görüneceğini, hangi odaların olacağını, kapıların nerede açılacağını belirler.

## Blog Modeli Üzerinden Adım Adım Model Oluşturma

### 1. Adım: İhtiyaç Analizi - "Ne Saklayacağız?"

Bir blog yazısı için hangi bilgilere ihtiyacımız var? Önce kağıt üzerinde düşünelim:

```
Blog Yazısı İçin Gerekli Bilgiler:
- Başlık (zorunlu)
- İçerik (zorunlu) 
- Yazar (kim yazdı?)
- Yayın tarihi
- Etiketler
- Kategori
- Görüntülenme sayısı
- SEO bilgileri
- Resimler
```

### 2. Adım: Temel Yapıyı Kurmak

```javascript
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  // Buraya alanlarımızı ekleyeceğiz
});
```

**Neden Schema?** Schema, verilerimizin yapısını tanımlar. Hangi alanların olacağını, hangi türde veri kabul edeceğini belirler.

### 3. Adım: Temel Alanları Eklemek

#### 3.1 Zorunlu Alanlar (Required Fields)

```javascript
title: {
  type: String,        // Metin türünde
  required: true,      // Zorunlu alan - boş geçilemez
  trim: true,          // Başındaki ve sonundaki boşlukları temizle
},
```

**Neden trim: true?** Kullanıcı yanlışlıkla "  Başlık  " şeklinde girerse, otomatik olarak "Başlık" haline gelir.

#### 3.2 Benzersiz Alanlar (Unique Fields)

```javascript
slug: {
  type: String,
  required: true,
  unique: true,        // Veritabanında tekrar edemez
  lowercase: true,     // Otomatik küçük harfe çevir
  trim: true,
},
```

**Slug nedir?** URL'de kullanılan temiz hali. "İlk Blog Yazım" → "ilk-blog-yazim"

#### 3.3 Seçenekli Alanlar (Enum Fields)

```javascript
category: {
  type: String,
  trim: true,
  enum: ["geliştirme", "kişisel", "teknoloji", "tasarım", "eğitim", "diğer"],
  default: "geliştirme"
},
```

**Neden enum?** Sadece belirli değerleri kabul eder. Yanlış kategori girişini engeller.

### 4. Adım: İlişkisel Alanlar (References)

```javascript
author: {
  type: mongoose.Schema.Types.ObjectId,  // Başka bir belgenin ID'si
  ref: "User",                           // User modeline referans
  required: true,
},
```

**Bu ne demek?** Blog yazısının yazarını User tablosundan çekeriz. Yazar bilgileri ayrı tutulur, sadece ID'si saklanır.

### 5. Adım: Dizi Alanları (Array Fields)

#### 5.1 Basit Dizi

```javascript
tags: [
  {
    type: String,
    trim: true,
  },
],
```

**Sonuç:** `["javascript", "react", "mongodb"]` şeklinde etiketler saklarız.

#### 5.2 Nesne Dizisi

```javascript
galleryImages: [
  {
    url: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
    }
  }
],
```

**Bu ne sağlar?** Her resim için URL, alt text ve açıklama saklayabiliriz.

### 6. Adım: İç İçe Nesneler (Nested Objects)

```javascript
seo: {
  title: {
    type: String,
    maxlength: 60,      // En fazla 60 karakter
    trim: true,
  },
  description: {
    type: String,
    maxlength: 160,     // Google'ın önerdiği limit
    trim: true,
  },
  keywords: [String]    // Kısa yazım şekli
},
```

**Neden iç içe?** SEO bilgilerini gruplandırır, kod daha düzenli olur.

### 7. Adım: Varsayılan Değerler ve Validasyonlar

```javascript
views: {
  type: Number,
  default: 0,           // Başlangıç değeri
},
priority: {
  type: Number,
  min: 1,               // En küçük değer
  max: 10,              // En büyük değer
  default: 5
},
status: {
  type: String,
  enum: ["draft", "published", "archived", "scheduled"],
  default: "draft"      // Yeni yazılar taslak olarak başlar
}
```

### 8. Adım: Otomatik İşlemler (Middleware)

#### 8.1 Kaydetmeden Önce (Pre-validate)

```javascript
blogSchema.pre("validate", function (next) {
  // Slug otomatik oluştur
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/\s+/g, "-")     // Boşlukları tire yap
      .replace(/[^\w-]+/g, ""); // Özel karakterleri kaldır
  }
  
  // Okuma süresini hesapla
  if (this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200); // Dakika başına 200 kelime
  }
  
  next(); // Devam et
});
```

#### 8.2 Kaydederken (Pre-save)

```javascript
blogSchema.pre("save", function (next) {
  this.updatedAt = Date.now(); // Güncelleme tarihini ayarla
  
  // Yayınlandığında tarihi kaydet
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});
```

### 9. Adım: Performans İçin İndeksler

```javascript
// Tekli indeksler
blogSchema.index({ slug: 1 });          // Slug'a göre hızlı arama
blogSchema.index({ publishedAt: -1 });  // Tarihe göre sıralama (-1 = azalan)

// Metin arama indeksi
blogSchema.index({ title: "text", content: "text" });

// Bileşik indeksler (birden fazla alan)
blogSchema.index({ status: 1, updatedAt: -1 }); // Durum + tarih
```

**Neden indeks?** Veritabanı sorguları çok daha hızlı çalışır. Telefon rehberindeki alfabetik sıralama gibi.

### 10. Adım: Sanal Alanlar (Virtual Fields)

```javascript
// Hesaplanan alanlar - veritabanında saklanmaz
blogSchema.virtual('readingTimeDisplay').get(function () {
  if (this.readingTime <= 1) {
    return '1 dakikadan az';
  }
  return `${this.readingTime} dakika`;
});

// Admin paneli için özet
blogSchema.virtual('adminSummary').get(function () {
  return {
    id: this._id,
    title: this.title,
    status: this.statusDisplay,
    views: this.views,
    // ... diğer önemli alanlar
  };
});
```

### 11. Adım: Özel Metodlar

#### 11.1 Instance Metodları (Tek belge için)

```javascript
// Görüntülenme sayısını artır
blogSchema.methods.incrementViews = function () {
  return this.updateOne({ $inc: { views: 1 } });
};

// Blog yazısını yayınla
blogSchema.methods.publish = function () {
  return this.updateOne({
    status: 'published',
    isPublished: true,
    publishedAt: new Date()
  });
};
```

#### 11.2 Static Metodları (Model için)

```javascript
// Yayınlanmış yazıları getir
blogSchema.statics.getPublished = function () {
  return this.find({ status: 'published' }).sort({ publishedAt: -1 });
};

// Admin paneli için sayfalama ile getir
blogSchema.statics.getForAdmin = function (page = 1, limit = 10, filters = {}) {
  const skip = (page - 1) * limit;
  let query = {};
  
  if (filters.status) query.status = filters.status;
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { content: { $regex: filters.search, $options: 'i' } }
    ];
  }
  
  return this.find(query)
    .populate('author', 'username')  // Yazar bilgilerini de getir
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);
};
```

### 12. Adım: Modeli Oluşturmak ve Dışa Aktarmak

```javascript
const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
```

## Model Tasarlarken Dikkat Edilecek Noktalar

### 1. Veri Türleri Seçimi

```javascript
// ✅ Doğru
age: { type: Number }           // Yaş için sayı
isActive: { type: Boolean }     // Aktif/pasif için boolean
createdAt: { type: Date }       // Tarih için Date

// ❌ Yanlış
age: { type: String }           // Yaş string olmamalı
isActive: { type: String }      // "true"/"false" string olarak saklamak verimsiz
```

### 2. Validasyon Kuralları

```javascript
// ✅ Doğru validasyonlar
email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
  match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Geçerli email giriniz']
},

// Telefon numarası
phone: {
  type: String,
  match: [/^[0-9]{10,11}$/, 'Geçerli telefon numarası giriniz']
}
```

### 3. Performans Optimizasyonu

```javascript
// ✅ Sık sorgulanan alanları indeksle
blogSchema.index({ status: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ createdAt: -1 });

// ✅ Bileşik indeksler kullan
blogSchema.index({ status: 1, publishedAt: -1 });

// ❌ Her alanı indeksleme - gereksiz yere yer kaplar
```

### 4. Güvenlik Önlemleri

```javascript
// ✅ Hassas bilgileri gizle
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;  // Şifreyi JSON'da gösterme
  delete user.__v;       // Version key'i gizle
  return user;
};

// ✅ Şifreleri hashle
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
```

## Gerçek Hayat Örnekleri

### E-ticaret Ürün Modeli

```javascript
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { 
    type: Number, 
    required: true, 
    min: [0, 'Fiyat negatif olamaz'] 
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  stock: { 
    type: Number, 
    default: 0,
    min: [0, 'Stok negatif olamaz']
  },
  images: [String],
  isActive: { type: Boolean, default: true }
});
```

### Kullanıcı Modeli

```javascript
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    minlength: 3,
    maxlength: 20
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true
  },
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: { type: String, maxlength: 500 }
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  }
});
```

## Sık Yapılan Hatalar ve Çözümleri

### 1. Aşırı Normalizasyon

```javascript
// ❌ Yanlış - Her şeyi ayrı koleksiyonda tutmak
const postSchema = new mongoose.Schema({
  title: String,
  authorId: ObjectId,
  categoryId: ObjectId,
  tagIds: [ObjectId]  // Her tag için ayrı koleksiyon
});

// ✅ Doğru - Basit veriler için embed kullan
const postSchema = new mongoose.Schema({
  title: String,
  author: { type: ObjectId, ref: 'User' },
  category: String,  // Basit string yeterli
  tags: [String]     // String array yeterli
});
```

### 2. Eksik Validasyon

```javascript
// ❌ Yanlış - Validasyon yok
price: Number

// ✅ Doğru - Uygun validasyonlar
price: {
  type: Number,
  required: [true, 'Fiyat zorunludur'],
  min: [0, 'Fiyat 0\'dan küçük olamaz'],
  max: [1000000, 'Fiyat çok yüksek']
}
```

### 3. Gereksiz İndeksler

```javascript
// ❌ Yanlış - Her alanı indekslemek
schema.index({ name: 1 });
schema.index({ email: 1 });
schema.index({ phone: 1 });
schema.index({ address: 1 });  // Gereksiz

// ✅ Doğru - Sadece sorgulanan alanları indeksle
schema.index({ email: 1 });     // Login için
schema.index({ createdAt: -1 }); // Sıralama için
```

## Özet: Model Oluştururken İzlenecek Adımlar

1. **İhtiyaç Analizi**: Ne saklayacağınızı belirleyin
2. **Veri Yapısını Planlayın**: Hangi alanlar, hangi türler
3. **İlişkileri Tanımlayın**: Hangi modeller birbirine bağlı
4. **Validasyonları Ekleyin**: Veri bütünlüğünü sağlayın
5. **İndeksleri Planlayın**: Performans için gerekli indeksler
6. **Metodları Yazın**: Sık kullanılan işlemler için
7. **Test Edin**: Modelinizi gerçek verilerle test edin

Bu rehber, MongoDB model oluştururken karşılaşacağınız temel konuları kapsar. Her proje farklıdır, bu yüzden ihtiyaçlarınıza göre uyarlayın!