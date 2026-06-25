import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["kitap", "video", "makale", "kurs", "arac", "diger"],
    default: "diger",
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  coverImage: {
    type: String,
    default: null,
  },
  coverImageFit: {
    type: String,
    enum: ["cover", "contain", "auto"],
    default: "cover",
  },
  author: {
    type: String,
    default: "",
    trim: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  language: {
    type: String,
    default: "tr",
    enum: ["tr", "en", "de", "fr", "es"],
  },
  difficulty: {
    type: String,
    enum: ["baslangic", "orta", "ileri", "uzman", null],
    default: null,
  },
  notes: {
    type: String,
    default: "",
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
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

resourceSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  }

  next();
});

resourceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

resourceSchema.index({ slug: 1 });
resourceSchema.index({ type: 1 });
resourceSchema.index({ tags: 1 });
resourceSchema.index({ language: 1 });
resourceSchema.index({ difficulty: 1 });
resourceSchema.index({ rating: -1 });
resourceSchema.index({ isActive: 1 });
resourceSchema.index({ isFeatured: 1 });
resourceSchema.index({ createdAt: -1 });
resourceSchema.index({ type: 1, isActive: 1 });
resourceSchema.index({ isFeatured: 1, isActive: 1 });
resourceSchema.index({ title: "text", description: "text" });

resourceSchema.virtual("typeDisplay").get(function () {
  const typeMap = {
    kitap: "Kitap",
    video: "Video",
    makale: "Makale",
    kurs: "Kurs",
    arac: "Araç",
    diger: "Diğer",
  };
  return typeMap[this.type] || this.type;
});

resourceSchema.virtual("difficultyDisplay").get(function () {
  const difficultyMap = {
    baslangic: "Başlangıç",
    orta: "Orta",
    ileri: "İleri",
    uzman: "Uzman",
  };
  return this.difficulty ? difficultyMap[this.difficulty] || this.difficulty : "";
});

export const ResourceModel =
  mongoose.models.Resource || mongoose.model("Resource", resourceSchema);

export default ResourceModel;
