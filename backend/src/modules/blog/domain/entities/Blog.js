export class Blog {
  constructor({
    id,
    title,
    slug,
    content,
    excerpt,
    tags = [],
    category,
    author,
    authorDetails = null,
    thumbnail,
    galleryImages = [],
    status = "draft",
    isPublished = false,
    isFeatured = false,
    allowComments = true,
    views = 0,
    likes = 0,
    shares = 0,
    readingTime = 0,
    publishedAt,
    scheduledFor,
    createdAt,
    updatedAt,
    tableOfContents = [],
    seo = null,
    analytics = null,
    revisions = [],
    language = "tr",
    priority = 5,
    featured = false,
  }) {
    this.id = id;
    this.title = title;
    this.slug = slug;
    this.content = content;
    this.excerpt = excerpt;
    this.tags = tags;
    this.category = category;
    this.author = author;
    this.authorDetails = authorDetails;
    this.thumbnail = thumbnail;
    this.galleryImages = galleryImages;
    this.status = status;
    this.isPublished = isPublished;
    this.isFeatured = isFeatured;
    this.featured = featured ?? isFeatured;
    this.allowComments = allowComments;
    this.views = views;
    this.likes = likes;
    this.shares = shares;
    this.readingTime = readingTime;
    this.publishedAt = publishedAt;
    this.scheduledFor = scheduledFor;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.tableOfContents = tableOfContents;
    this.seo = seo;
    this.analytics = analytics;
    this.revisions = revisions;
    this.language = language;
    this.priority = priority;
  }

  static fromPersistence(model) {
    if (!model) return null;

    const doc = typeof model.toObject === "function" ? model.toObject() : model;

    return new Blog({
      id: doc._id?.toString?.() ?? doc.id,
      title: doc.title,
      slug: doc.slug,
      content: doc.content,
      excerpt: doc.excerpt,
      tags: doc.tags,
      category: doc.category,
      author:
        typeof doc.author === "object"
          ? (doc.author?._id ?? doc.author?.id ?? doc.author)
          : doc.author,
      authorDetails: typeof doc.author === "object" ? doc.author : null,
      thumbnail: doc.thumbnail,
      galleryImages: doc.galleryImages,
      status: doc.status,
      isPublished: doc.isPublished,
      isFeatured: doc.featured,
      featured: doc.featured,
      allowComments: doc.allowComments,
      views: doc.views,
      likes: doc.likes,
      shares: doc.shares,
      readingTime: doc.readingTime,
      publishedAt: doc.publishedAt,
      scheduledFor: doc.scheduledFor,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      tableOfContents: doc.tableOfContents,
      seo: doc.seo,
      analytics: doc.analytics,
      revisions: doc.revisions,
      language: doc.language,
      priority: doc.priority,
    });
  }
}

export default Blog;
