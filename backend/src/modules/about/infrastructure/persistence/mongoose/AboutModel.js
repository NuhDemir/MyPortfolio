import mongoose from "mongoose";

const ctaSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    url: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const statSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    valueSource: {
      type: String,
      enum: ["static", "github"],
      default: "static",
    },
    staticValue: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
    githubField: {
      type: String,
      enum: ["public_repos", "followers", "following", "public_gists"],
      default: "public_repos",
    },
    cta: {
      type: ctaSchema,
      default: () => ({}),
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const modalItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    linkLabel: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    linkUrl: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const modalSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    items: {
      type: [modalItemSchema],
      default: [],
    },
  },
  { _id: false },
);

const serviceModalSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    lead: {
      type: String,
      required: true,
      trim: true,
      maxlength: 600,
    },
    sections: {
      type: [modalSectionSchema],
      default: [],
    },
    footnote: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    footnoteLinkLabel: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    footnoteLinkUrl: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const linkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 80 },
    url: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const serviceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    iconUrl: {
      type: String,
      trim: true,
    },
    iconBgColor: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 800,
    },
    order: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      trim: true,
    },
    problem: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    solution: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    desc: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    tech: {
      type: [String],
      default: [],
    },
    links: {
      type: [linkSchema],
      default: [],
    },
    modal: {
      type: serviceModalSchema,
    },
  },
  { _id: false },
);

const aboutSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      default: "main",
      trim: true,
      lowercase: true,
    },
    header: {
      badge: {
        type: String,
        trim: true,
        maxlength: 50,
      },
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120,
      },
      subtitle: {
        type: String,
        trim: true,
        maxlength: 300,
      },
    },
    github: {
      username: {
        type: String,
        required: true,
        trim: true,
      },
      profileUrl: {
        type: String,
        required: true,
        trim: true,
      },
    },
    stats: {
      type: [statSchema],
      default: [],
    },
    services: {
      type: [serviceSchema],
      default: [],
    },
    seo: {
      title: {
        type: String,
        trim: true,
        maxlength: 80,
      },
      description: {
        type: String,
        trim: true,
        maxlength: 180,
      },
      keywords: {
        type: [String],
        default: [],
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    meta: {
      version: {
        type: Number,
        default: 1,
      },
      lastEditedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      lastEditedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  },
);

aboutSchema.pre("validate", function (next) {
  if (this.github?.username && !this.github?.profileUrl) {
    this.github.profileUrl = `https://github.com/${this.github.username}`;
  }

  next();
});

aboutSchema.index({ isActive: 1, updatedAt: -1 });

export const AboutModel =
  mongoose.models.About || mongoose.model("About", aboutSchema);

export default AboutModel;
