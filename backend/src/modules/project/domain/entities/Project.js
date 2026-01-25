export class Project {
  constructor({
    id,
    externalId,
    title,
    slug,
    description,
    excerpt,
    imageUrl,
    metadata = null,
    visuals = null,
    techStack = [],
    links = null,
    caseStudy = null,
    galleryImages = [],
    githubUrl,
    liveUrl,
    tags = [],
    category,
    technologies = [],
    featured = false,
    isFeatured = false,
    status = "active",
    priority = 5,
    difficulty = "intermediate",
    duration,
    startDate,
    endDate,
    views = 0,
    likes = 0,
    shares = 0,
    seo = {},
    client = {},
    metrics = {},
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.externalId = externalId;
    this.title = title;
    this.slug = slug;
    this.description = description;
    this.excerpt = excerpt;
    this.imageUrl = imageUrl;
    this.metadata = metadata;
    this.visuals = visuals;
    this.techStack = techStack;
    this.links = links;
    this.caseStudy = caseStudy;
    this.galleryImages = galleryImages;
    this.githubUrl = githubUrl;
    this.liveUrl = liveUrl;
    this.tags = tags;
    this.category = category;
    this.technologies = technologies;
    this.featured = featured;
    this.isFeatured = isFeatured;
    this.status = status;
    this.priority = priority;
    this.difficulty = difficulty;
    this.duration = duration;
    this.startDate = startDate;
    this.endDate = endDate;
    this.views = views;
    this.likes = likes;
    this.shares = shares;
    this.seo = seo;
    this.client = client;
    this.metrics = metrics;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(model) {
    if (!model) return null;

    const doc = typeof model.toObject === "function" ? model.toObject() : model;

    return new Project({
      id: doc._id?.toString?.() ?? doc.id,
      externalId: doc.externalId,
      title: doc.title,
      slug: doc.slug,
      description: doc.description,
      excerpt: doc.excerpt,
      imageUrl: doc.imageUrl,
      metadata: doc.metadata,
      visuals: doc.visuals,
      techStack: doc.techStack,
      links: doc.links,
      caseStudy: doc.caseStudy,
      galleryImages: doc.galleryImages,
      githubUrl: doc.githubUrl,
      liveUrl: doc.liveUrl,
      tags: doc.tags,
      category: doc.category,
      technologies: doc.technologies,
      featured: doc.featured,
      isFeatured: doc.isFeatured,
      status: doc.status,
      priority: doc.priority,
      difficulty: doc.difficulty,
      duration: doc.duration,
      startDate: doc.startDate,
      endDate: doc.endDate,
      views: doc.views,
      likes: doc.likes,
      shares: doc.shares,
      seo: doc.seo,
      client: doc.client,
      metrics: doc.metrics,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}

export default Project;
