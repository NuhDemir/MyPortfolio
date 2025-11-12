# Shared Button System - Kullanım Kılavuzu

## 📋 Genel Bakış

Bu dosya, projenin merkezi buton sistemi hakkında detaylı bilgi içerir. Tüm butonlar `components.css` dosyasında tanımlanmış ve tutarlı bir tasarım dili sağlamak için standardize edilmiştir.

## 🎯 Temel Kullanım

### Basit Buton

```jsx
<button className="btn">Buton</button>
```

### İkonlu Buton

```jsx
<button className="btn btn--primary">
  <AddIcon className="btn__icon" />
  Ekle
</button>
```

## 🎨 Buton Varyantları

### 1. Primary (Birincil)

Ana aksiyonlar için kullanılır.

```jsx
<button className="btn btn--primary">Gönder</button>
```

- Renk: `--color-primary` (#0cb845)
- Hover: `--color-accent`

### 2. Secondary (İkincil)

İkincil aksiyonlar, iptal butonları için kullanılır.

```jsx
<button className="btn btn--secondary">İptal</button>
```

- Renk: Şeffaf arka plan, border ile
- Hover: `--color-surface` arka plan

### 3. Accent

Vurgulu aksiyonlar için kullanılır.

```jsx
<button className="btn btn--accent">Özel Aksiyon</button>
```

- Renk: `--color-accent`
- Hover: `--color-accent-hover`

### 4. Success (Başarı)

Onay, kabul etme işlemleri için kullanılır.

```jsx
<button className="btn btn--success">Onayla</button>
```

- Renk: #4caf50 (Yeşil)

### 5. Danger (Tehlike)

Silme, reddedme gibi kritik işlemler için kullanılır.

```jsx
<button className="btn btn--danger">Sil</button>
```

- Renk: #f44336 (Kırmızı)

### 6. Warning (Uyarı)

Dikkat gerektiren işlemler için kullanılır.

```jsx
<button className="btn btn--warning">Dikkat</button>
```

- Renk: #ffa500 (Turuncu)

## 📏 Buton Boyutları

### Large (Büyük)

```jsx
<button className="btn btn--primary btn--lg">Büyük Buton</button>
```

- Padding: 1.25rem 2rem
- Font: 1.1rem
- İkon: 1.5rem

### Normal (Varsayılan)

```jsx
<button className="btn btn--primary">Normal Buton</button>
```

- Padding: 0.85rem 1.65rem
- Font: 1rem
- İkon: 1.25rem

### Small (Küçük)

```jsx
<button className="btn btn--primary btn--sm">Küçük Buton</button>
```

- Padding: 0.6rem 1.25rem
- Font: 0.9rem
- İkon: 1rem

## 🔧 Özel Modifikasyonlar

### Pill (Yuvarlak Kenarlı)

```jsx
<button className="btn btn--primary btn--pill">Pill Buton</button>
```

- Border-radius: 999px (tam yuvarlak)

### Full Width (Tam Genişlik)

```jsx
<button className="btn btn--primary btn--full">Full Width</button>
```

- Width: 100%

### Icon Only (Sadece İkon)

```jsx
<button className="btn btn--primary btn--icon-only">
  <AddIcon className="btn__icon" />
</button>
```

- Kare buton (44x44px minimum)
- İkon merkezde

### Mobile Full Width

```jsx
<button className="btn btn--primary btn--mobile-full">Mobilde Full</button>
```

- Mobile'da (≤768px) width: 100%
- Desktop'ta normal boyut

## 👨‍💼 Admin Butonları

Admin panelinde kullanılmak üzere özel stil:

```jsx
<button className="btn btn--admin btn--primary">Admin Buton</button>
```

Özellikler:

- Uppercase text
- Letter-spacing: 0.12em
- Admin border ve shadow değişkenleri
- Özel hover animasyonu

## 📦 Buton Grupları

Birden fazla butonu yan yana yerleştirme:

```jsx
<div className="btn-group">
  <button className="btn btn--secondary">İptal</button>
  <button className="btn btn--primary">Kaydet</button>
</div>
```

- Gap: 0.75rem
- Flex-wrap: wrap

## 🎯 Kullanım Örnekleri

### CommentSection Örneği

```jsx
// Yorum ekle butonu
<button className="btn btn--primary btn--lg comment-section__add-btn">
  <AddCommentIcon className="btn__icon" />
  Hadi sen de bir yorum bırak!
</button>

// Form butonları
<div className="comment-form__actions">
  <button className="btn btn--secondary btn--mobile-full">
    <CloseIcon className="btn__icon" />
    İptal
  </button>
  <button className="btn btn--primary btn--mobile-full">
    <SendIcon className="btn__icon" />
    Yorumu Gönder
  </button>
</div>
```

### Admin Management Örneği

```jsx
<button className="btn btn--admin btn--primary">
  <AddIcon className="btn__icon" />
  Yeni Ekle
</button>

<div className="btn-group">
  <button className="btn btn--admin btn--success btn--sm">
    <CheckIcon className="btn__icon" />
    Onayla
  </button>
  <button className="btn btn--admin btn--danger btn--sm">
    <DeleteIcon className="btn__icon" />
    Sil
  </button>
</div>
```

## 📱 Responsive Davranış

### 768px ve altı (Tablet/Mobile)

- Padding azalır
- Font boyutları küçülür
- `btn--mobile-full` aktif olur

### 480px ve altı (Small Mobile)

- Daha kompakt padding
- İkon boyutları azalır

## ♿ Erişilebilirlik

- Tüm butonlar `:disabled` state'i destekler
- Opacity: 0.5 (disabled durumda)
- Cursor: not-allowed (disabled durumda)
- Minimum tıklama alanı: 44x44px
- Focus-visible state'leri korunmuştur

## 🎨 Tema Desteği

Butonlar CSS değişkenlerini kullandığı için otomatik olarak dark mode'u destekler:

- `--color-primary`
- `--color-accent`
- `--color-background-paper`
- `--color-text-primary`
- `--color-text-on-primary`
- `--color-line`
- `--color-surface`

## 📝 Class Kombinasyonları

```jsx
// Tüm özellikler birlikte kullanılabilir
<button className="btn btn--primary btn--lg btn--pill btn--full">
  <SaveIcon className="btn__icon" />
  Kaydet
</button>

// Admin + Success + Small
<button className="btn btn--admin btn--success btn--sm">
  Onayla
</button>

// Secondary + Icon Only
<button className="btn btn--secondary btn--icon-only">
  <CloseIcon className="btn__icon" />
</button>
```

## ⚠️ Dikkat Edilmesi Gerekenler

1. **İkon sınıfı**: Material-UI iconları için `btn__icon` sınıfını kullanın ve `!important` ekleyin:

   ```jsx
   className = "btn__icon";
   ```

2. **Disabled state**: Asenkron işlemler için disabled kullanın:

   ```jsx
   <button className="btn btn--primary" disabled={isLoading}>
     {isLoading ? "Gönderiliyor..." : "Gönder"}
   </button>
   ```

3. **Mobile responsive**: Mobilde full-width istiyorsanız:

   ```jsx
   <button className="btn btn--primary btn--mobile-full">
   ```

4. **Buton grubu**: Form action'ları için `btn-group` kullanın:
   ```jsx
   <div className="btn-group">
     <button className="btn btn--secondary">İptal</button>
     <button className="btn btn--primary">Kaydet</button>
   </div>
   ```

## 🔄 Migrasyon Notları

Eski buton stilleri shared button sistemine taşındı:

### Önce (Old)

```jsx
<button className="comment-section__add-btn">Yorum Ekle</button>
```

### Sonra (New)

```jsx
<button className="btn btn--primary btn--lg comment-section__add-btn">
  <AddCommentIcon className="btn__icon" />
  Yorum Ekle
</button>
```

## 📚 İlgili Dosyalar

- **Stil Tanımları**: `/frontend/src/shared/styles/base/components.css`
- **Global Değişkenler**: `/frontend/src/shared/styles/base/global.css`
- **Import Yeri**: `/frontend/src/app/App.jsx`

## 🎓 Best Practices

1. ✅ Tek bir buton sistemini kullanın (tutarlılık)
2. ✅ Semantik sınıf isimleri kullanın (`btn--primary`, `btn--danger`)
3. ✅ İkonları `btn__icon` ile sarmalayın
4. ✅ Mobile için `btn--mobile-full` kullanın
5. ✅ Gruplar için `btn-group` wrapper kullanın
6. ❌ Inline style kullanmayın
7. ❌ Gradient background kullanmayın (artık desteklenmiyor)
8. ❌ Custom padding/font-size eklemeyin (modifier kullanın)

---

**Son Güncelleme**: 12 Kasım 2025  
**Versiyon**: 1.0.0  
**Geliştirici**: MyPortfolio Team
