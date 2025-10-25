import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    maxlength: 300,
    trim: true,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  category: {
    type: String,
    trim: true,
    enum: ["geliştirme", "kişisel", "teknoloji", "tasarım", "eğitim", "diğer"],
    default: "geliştirme",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  thumbnail: {
    type: String,
    required: false,
  },
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
      },
      mediaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
      },
      order: {
        type: Number,
        default: 0,
      },
    },
  ],
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
  scheduledFor: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived", "scheduled"],
    default: "draft",
  },
  featured: {
    type: Boolean,
    default: false,
  },
  allowComments: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  shares: {
    type: Number,
    default: 0,
  },
  readingTime: {
    type: Number,
    default: 0,
  },
  seo: {
    title: {
      type: String,
      maxlength: 60,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 160,
      trim: true,
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    ogImage: {
      type: String,
    },
    canonicalUrl: {
      type: String,
      trim: true,
    },
    focusKeyword: {
      type: String,
      trim: true,
    },
    metaRobots: {
      type: String,
      enum: ["index,follow", "noindex,follow", "index,nofollow", "noindex,nofollow"],
      default: "index,follow",
    },
  },
  tableOfContents: [
    {
      level: {
        type: Number,
        min: 1,
        max: 6,
      },
      title: {
        type: String,
        trim: true,
      },
      anchor: {
        type: String,
        trim: true,
      },
    },
  ],
  contentType: {
    type: String,
    enum: ["markdown", "html", "rich-text"],
    default: "markdown",
  },
  language: {
    type: String,
    default: "tr",
    enum: ["tr", "en", "de", "fr", "es"],
  },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5,
  },
  analytics: {
    avgTimeOnPage: {
      type: Number,
      default: 0,
    },
    bounceRate: {
      type: Number,
      default: 0,
    },
    socialShares: {
      facebook: { type: Number, default: 0 },
      twitter: { type: Number, default: 0 },
      linkedin: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
  },
  revisions: [
    {
      version: {
        type: Number,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      modifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      modifiedAt: {
        type: Date,
        default: Date.now,
      },
      changeNote: {
        type: String,
        trim: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

blogSchema.pre("validate", function (next) {
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

  if (this.content && !this.excerpt) {
    const plainText = this.content
      .replace(/[#*`_~\[\]()]/g, "")
      .replace(/\n+/g, " ")
      .trim();
    this.excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? "..." : "");
  }

  if (this.content) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }

  next();
});

blogSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  this.isPublished = this.status === "published";

  next();
});

blogSchema.index({ title: "text", content: "text", excerpt: "text" });
blogSchema.index({ slug: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ author: 1 });
blogSchema.index({ status: 1 });
blogSchema.index({ isPublished: 1 });
blogSchema.index({ featured: 1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ updatedAt: -1 });
blogSchema.index({ views: -1 });
blogSchema.index({ likes: -1 });
blogSchema.index({ priority: -1 });
blogSchema.index({ language: 1 });
blogSchema.index({ scheduledFor: 1 });
blogSchema.index({ status: 1, updatedAt: -1 });
blogSchema.index({ author: 1, status: 1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ featured: 1, status: 1, publishedAt: -1 });

blogSchema.virtual("statusDisplay").get(function () {
  const statusMap = {
    draft: "Taslak",
    published: "Yayınlandı",
    archived: "Arşivlenmiş",
    scheduled: "Zamanlanmış",
  };
  return statusMap[this.status] || this.status;
});

blogSchema.virtual("readingTimeDisplay").get(function () {
  if (this.readingTime <= 1) {
    return "1 dakikadan az";
  }
  return `${this.readingTime} dakika`;
});

blogSchema.virtual("adminSummary").get(function () {
  return {
    id: this._id,
    title: this.title,
    status: this.status,
    statusDisplay: this.statusDisplay,
    author: this.author,
    category: this.category,
    views: this.views,
    likes: this.likes,
    readingTime: this.readingTimeDisplay,
    publishedAt: this.publishedAt,
    updatedAt: this.updatedAt,
    featured: this.featured,
    thumbnail: this.thumbnail,
  };
});

blogSchema.methods.incrementViews = function () {
  return this.updateOne({ $inc: { views: 1 } });
};

blogSchema.methods.toggleFeatured = function () {
  return this.updateOne({ featured: !this.featured });
};

blogSchema.methods.publish = function () {
  return this.updateOne({
    status: "published",
    isPublished: true,
    publishedAt: new Date(),
  });
};

blogSchema.methods.createRevision = function (modifiedBy, changeNote = "") {
  const revision = {
    version: this.revisions.length + 1,
    content: this.content,
    title: this.title,
    modifiedBy,
    changeNote,
  };

  return this.updateOne({ $push: { revisions: revision } });
};

blogSchema.statics.getPublished = function () {
  return this.find({ status: "published" }).sort({ publishedAt: -1 });
};

blogSchema.statics.getFeatured = function () {
  return this.find({ featured: true, status: "published" }).sort({ publishedAt: -1 });
};

blogSchema.statics.getByCategory = function (category) {
  return this.find({ category, status: "published" }).sort({ publishedAt: -1 });
};

blogSchema.statics.getByTag = function (tag) {
  return this.find({ tags: tag, status: "published" }).sort({ publishedAt: -1 });
};

blogSchema.statics.getForAdmin = function (page = 1, limit = 10, filters = {}) {
  const skip = (page - 1) * limit;
  let query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.featured !== undefined) {
    query.featured = filters.featured;
  }

  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  return this.find(query)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "username email profile")
    .lean();
};

blogSchema.statics.countForAdmin = function (filters = {}) {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.featured !== undefined) {
    query.featured = filters.featured;
  }

  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  return this.countDocuments(query);
};

export const BlogModel = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default BlogModel;
