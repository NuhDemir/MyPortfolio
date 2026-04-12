export class AboutContent {
  constructor({
    id,
    slug = "main",
    header = {},
    github = {},
    stats = [],
    services = [],
    seo = {},
    isActive = true,
    meta = {},
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.slug = slug;
    this.header = header;
    this.github = github;
    this.stats = stats;
    this.services = services;
    this.seo = seo;
    this.isActive = isActive;
    this.meta = meta;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(model) {
    if (!model) {
      return null;
    }

    const doc = typeof model.toObject === "function" ? model.toObject() : model;

    return new AboutContent({
      id: doc._id?.toString?.() ?? doc.id,
      slug: doc.slug,
      header: doc.header ?? {},
      github: doc.github ?? {},
      stats: Array.isArray(doc.stats) ? doc.stats : [],
      services: Array.isArray(doc.services) ? doc.services : [],
      seo: doc.seo ?? {},
      isActive: Boolean(doc.isActive),
      meta: doc.meta ?? {},
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}

export default AboutContent;
