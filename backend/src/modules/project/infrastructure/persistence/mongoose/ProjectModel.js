import mongoose from "mongoose";

/**
 * Project Mongoose Schema — v3
 *
 * Canonical fields:
 *   tagline, context, technologies[].proficiency,
 *   visuals.{ heroImageUrl, ogImage, accentColor, architectureDiagramUrl,
 *              wireframeUrl, beforeImageUrl, afterImageUrl },
 *   galleryImages[].type,
 *   caseStudy.{ impact, highlights[], metrics[].unit, gallery[] },
 *   metrics.{ testCoverage, deployments },
 *   links.documentation
 *
 * Backward-compat fields kept (populated by pre-validate hook from legacy docs):
 *   imageUrl, metadata, featured, techStack, githubUrl, liveUrl,
 *   duration, startDate, endDate, difficulty, shares
 */
const projectSchema = new mongoose.Schema({
  externalId: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
  },

  // ── Identity ─────────────────────────────────────────────────────────────
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
  tagline: {
    type: String,
    trim: true,
    maxlength: 200,
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

  // ── Classification ───────────────────────────────────────────────────────
  category: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ["active", "archived", "draft", "maintenance"],
    default: "active",
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true,
  },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5,
  },
  tags: [{ type: String, trim: true }],

  // ── Developer Context ────────────────────────────────────────────────────
  context: {
    role: { type: String, trim: true },
    teamSize: { type: Number, min: 1, default: 1 },
    platform: { type: String, trim: true },
    duration: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "intermediate",
    },
    repositoryAccess: {
      type: String,
      enum: ["public", "private", "enterprise", "open-source"],
    },
    architecture: {
      type: String,
      enum: [
        "monolithic",
        "microservices",
        "serverless",
        "jamstack",
        "spa",
        "ssr",
        "pwa",
        "other",
      ],
    },
  },

  // ── Visuals (consolidated) ───────────────────────────────────────────────
  visuals: {
    thumbnailUrl: { type: String },
    heroImageUrl: { type: String },
    heroVideoUrl: { type: String },
    ogImage: { type: String },
    primaryColor: { type: String, trim: true },
    accentColor: { type: String, trim: true },
    architectureDiagramUrl: { type: String },
    wireframeUrl: { type: String },
    beforeImageUrl: { type: String },
    afterImageUrl: { type: String },
  },

  // ── Technologies (merged techStack + technologies) ───────────────────────
  technologies: [
    {
      name: { type: String, required: true, trim: true },
      category: {
        type: String,
        enum: [
          "frontend",
          "backend",
          "database",
          "devops",
          "design",
          "testing",
          "mobile",
          "other",
        ],
        default: "other",
      },
      proficiency: {
        type: String,
        enum: ["learning", "competent", "proficient", "expert"],
      },
    },
  ],

  // ── Links ────────────────────────────────────────────────────────────────
  links: {
    liveDemo: { type: String, trim: true },
    github: { type: String, trim: true },
    figma: { type: String, trim: true },
    documentation: { type: String, trim: true },
  },

  // ── Gallery ──────────────────────────────────────────────────────────────
  galleryImages: [
    {
      url: { type: String, required: true },
      alt: { type: String, trim: true },
      caption: { type: String, trim: true },
      type: {
        type: String,
        enum: ["screenshot", "diagram", "wireframe", "mockup", "other"],
        default: "screenshot",
      },
    },
  ],

  // ── Case Study ───────────────────────────────────────────────────────────
  caseStudy: {
    problem: {
      title: { type: String, trim: true },
      description: { type: String },
    },
    solution: {
      title: { type: String, trim: true },
      description: { type: String },
    },
    impact: { type: String, trim: true, maxlength: 300 },
    highlights: [{ type: String, trim: true }],
    challenges: [
      {
        title: { type: String, trim: true },
        description: { type: String },
      },
    ],
    metrics: [
      {
        label: { type: String, trim: true },
        value: { type: String, trim: true },
        unit: { type: String, trim: true },
      },
    ],
    highlightCode: {
      language: { type: String, trim: true },
      fileName: { type: String, trim: true },
      codeSnippet: { type: String },
      gistUrl: { type: String, trim: true },
    },
    gallery: [
      {
        url: { type: String, required: true },
        alt: { type: String, trim: true },
        caption: { type: String, trim: true },
      },
    ],
  },

  // ── Engagement ───────────────────────────────────────────────────────────
  views: { type: Number, default: 0, min: 0 },
  likes: { type: Number, default: 0, min: 0 },

  // ── SEO ──────────────────────────────────────────────────────────────────
  seo: {
    title: { type: String, maxlength: 60, trim: true },
    description: { type: String, maxlength: 160, trim: true },
    keywords: [{ type: String, trim: true }],
  },

  // ── Client ───────────────────────────────────────────────────────────────
  client: {
    name: { type: String, trim: true },
    website: { type: String, trim: true },
    testimonial: { type: String, maxlength: 500 },
  },

  // ── Dev Metrics ──────────────────────────────────────────────────────────
  metrics: {
    codeLines: { type: Number, min: 0 },
    commits: { type: Number, min: 0 },
    contributors: { type: Number, min: 1, default: 1 },
    testCoverage: { type: Number, min: 0, max: 100 },
    deployments: { type: Number, min: 0 },
  },

  // ── Timestamps ───────────────────────────────────────────────────────────
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // ── Backward-Compat Shims (soft-deprecated) ──────────────────────────────
  // These are kept so that existing MongoDB documents still validate.
  // The pre-validate hook migrates them into the canonical fields above.
  imageUrl: { type: String },
  metadata: {
    title: { type: String, trim: true },
    tagline: { type: String, trim: true },
    createdAt: { type: Date },
    role: { type: String, trim: true },
    platform: { type: String, trim: true },
    status: { type: String, trim: true },
  },
  featured: { type: Boolean, default: false },
  techStack: [
    {
      category: { type: String, trim: true },
      items: [{ type: String, trim: true }],
    },
  ],
  githubUrl: { type: String },
  liveUrl: { type: String },
  duration: { type: String, trim: true },
  startDate: { type: Date },
  endDate: { type: Date },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
  },
  shares: { type: Number, default: 0 },
});

// ── Pre-validate: migrate legacy shapes → canonical fields ─────────────────

projectSchema.pre("validate", function (next) {
  // title ← metadata.title
  if (!this.title && this.metadata?.title) {
    this.title = this.metadata.title;
  }

  // tagline ← metadata.tagline
  if (!this.tagline && this.metadata?.tagline) {
    this.tagline = this.metadata.tagline;
  }

  // description ← tagline (if description still empty)
  if (!this.description && this.tagline) {
    this.description = this.tagline;
  }

  // visuals.thumbnailUrl ← imageUrl
  if (!this.visuals?.thumbnailUrl && this.imageUrl) {
    this.visuals = { ...(this.visuals ?? {}), thumbnailUrl: this.imageUrl };
  }

  // imageUrl ← visuals.thumbnailUrl (keep shim populated for legacy consumers)
  if (!this.imageUrl && this.visuals?.thumbnailUrl) {
    this.imageUrl = this.visuals.thumbnailUrl;
  }

  // isFeatured ↔ featured sync
  if (this.isFeatured == null && this.featured != null) {
    this.isFeatured = this.featured;
  }
  if (this.featured == null && this.isFeatured != null) {
    this.featured = this.isFeatured;
  }

  // context ← legacy scattered fields
  if (!this.context) this.context = {};
  if (!this.context.role && this.metadata?.role) {
    this.context.role = this.metadata.role;
  }
  if (!this.context.platform && this.metadata?.platform) {
    this.context.platform = this.metadata.platform;
  }
  if (!this.context.duration && this.duration) {
    this.context.duration = this.duration;
  }
  if (!this.context.startDate && this.startDate) {
    this.context.startDate = this.startDate;
  }
  if (!this.context.endDate && this.endDate) {
    this.context.endDate = this.endDate;
  }
  if (!this.context.difficulty && this.difficulty) {
    this.context.difficulty = this.difficulty;
  }

  // links ← legacy githubUrl / liveUrl
  if (!this.links) this.links = {};
  if (!this.links.github && this.githubUrl) {
    this.links.github = this.githubUrl;
  }
  if (!this.links.liveDemo && this.liveUrl) {
    this.links.liveDemo = this.liveUrl;
  }

  // technologies ← techStack (flatten if technologies is still empty)
  if (
    (!this.technologies || this.technologies.length === 0) &&
    Array.isArray(this.techStack) &&
    this.techStack.length > 0
  ) {
    this.technologies = this.techStack.flatMap((group) =>
      (group.items || []).map((item) => ({
        name: item,
        category: (group.category || "other").toLowerCase(),
      })),
    );
  }

  // auto-generate slug from title
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

  // auto-generate excerpt from description
  if (this.description && !this.excerpt) {
    this.excerpt =
      this.description.substring(0, 150) +
      (this.description.length > 150 ? "..." : "");
  }

  next();
});

projectSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  // Keep featured shim in sync
  this.featured = this.isFeatured;
  next();
});

// ── Indexes ───────────────────────────────────────────────────────────────
projectSchema.index({ title: "text", description: "text", tagline: "text", excerpt: "text" });
projectSchema.index({ tags: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ "context.platform": 1 });
projectSchema.index({ "context.architecture": 1 });
projectSchema.index({ "context.repositoryAccess": 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ views: -1 });
projectSchema.index({ likes: -1 });
projectSchema.index({ priority: -1 });
// Compound index for the most common list query: featured active projects by priority
projectSchema.index({ isFeatured: 1, status: 1, priority: -1 });

// ── Virtuals ──────────────────────────────────────────────────────────────
projectSchema.virtual("durationInDays").get(function () {
  const start = this.context?.startDate ?? this.startDate;
  const end   = this.context?.endDate   ?? this.endDate;
  if (start && end) {
    return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
  }
  return null;
});

projectSchema.virtual("statusDisplay").get(function () {
  const map = {
    active:      "Aktif",
    archived:    "Arşivlenmiş",
    draft:       "Taslak",
    maintenance: "Bakımda",
  };
  return map[this.status] || this.status;
});

// ── Instance Methods ──────────────────────────────────────────────────────
projectSchema.methods.incrementViews = function () {
  return this.updateOne({ $inc: { views: 1 } });
};

projectSchema.methods.toggleFeatured = function () {
  const next = !this.isFeatured;
  return this.updateOne({ isFeatured: next, featured: next });
};

// ── Static Methods ────────────────────────────────────────────────────────
projectSchema.statics.getFeatured = function () {
  return this.find({ isFeatured: true, status: "active" }).sort({
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
