import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String, // URL'de kullanılacak başlık (örneğin: "ilk-blog-yazisi")
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  content: {
    type: String, // Markdown içeriği burada saklanacak
    required: true,
  },
  tags: [
    {
      type: String, // Blog yazısının etiketleri
      trim: true,
    },
  ],
  category: {
    type: String, // Blog yazısının kategorisi (örneğin: "Geliştirme", "Kişisel")
    trim: true,
    required: false,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId, // Kimin yazdığını gösterir (User modeline referans)
    ref: "User",
    required: true,
  },
  thumbnail: {
    type: String, // Blog yazısı için küçük resim URL'si
    required: false,
  },
  isPublished: {
    type: Boolean,
    default: false, // Taslak mı, yayınlandı mı?
  },
  views: {
    type: Number,
    default: 0, // Kaç kere görüntülendiği
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// -- Blog başlığından otomatik slug oluşturma --
blogSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toString()
      .normalize("NFD") // Diyakritik işaretleri ayır
      .replace(/[\u0300-\u036f]/g, "") // Diyakritik işaretleri kaldır
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Boşlukları tireye çevir
      .replace(/[^\w-]+/g, "") // Kelime ve tire dışındaki karakterleri kaldır
      .replace(/--+/g, "-"); // Birden fazla tireyi tek tireye indirge
  }
  next();
});

blogSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
