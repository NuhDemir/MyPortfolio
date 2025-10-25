import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
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
    required: true,
  },
  excerpt: {
    type: String,
    maxlength: 200,
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
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
    },
  ],
  githubUrl: {
    type: String,
  },
  liveUrl: {
    type: String,
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
    enum: ["web", "mobile", "desktop", "api", "library", "other"],
    default: "web",
  },
  technologies: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      category: {
        type: String,
        enum: ["frontend", "backend", "database", "devops", "design", "other"],
        default: "other",
      },
    },
  ],
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["active", "archived", "draft", "maintenance"],
    default: "active",
  },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5,
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "intermediate",
  },
  duration: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
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
  },
  client: {
    name: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    testimonial: {
      type: String,
      maxlength: 500,
    },
  },
  metrics: {
    codeLines: {
      type: Number,
      min: 0,
    },
    commits: {
      type: Number,
      min: 0,
    },
    contributors: {
      type: Number,
      min: 1,
      default: 1,
    },
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

projectSchema.pre("validate", function (next) {
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

  if (this.description && !this.excerpt) {
    this.excerpt =
      this.description.substring(0, 150) +
      (this.description.length > 150 ? "..." : "");
  }

  next();
});

projectSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

projectSchema.index({ title: "text", description: "text", excerpt: "text" });
projectSchema.index({ slug: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ views: -1 });
projectSchema.index({ likes: -1 });
projectSchema.index({ priority: -1 });

projectSchema.virtual("durationInDays").get(function () {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return null;
});

projectSchema.virtual("statusDisplay").get(function () {
  const statusMap = {
    active: "Aktif",
    archived: "Arşivlenmiş",
    draft: "Taslak",
    maintenance: "Bakımda",
  };
  return statusMap[this.status] || this.status;
});

projectSchema.methods.incrementViews = function () {
  return this.updateOne({ $inc: { views: 1 } });
};

projectSchema.methods.toggleFeatured = function () {
  return this.updateOne({ featured: !this.featured });
};

projectSchema.statics.getFeatured = function () {
  return this.find({ featured: true, status: "active" }).sort({
    priority: -1,
    createdAt: -1,
  });
};

projectSchema.statics.getByCategory = function (category) {
  return this.find({ category, status: "active" }).sort({ createdAt: -1 });
};

export const ProjectModel =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default ProjectModel;
