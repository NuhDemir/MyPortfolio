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
    thumbnail,
    galleryImages = [],
    status = "draft",
    isPublished = false,
    isFeatured = false,
    allowComments = true,
    views = 0,
    likes = 0,
    readingTime = 0,
    publishedAt,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.title = title;
    this.slug = slug;
    this.content = content;
    this.excerpt = excerpt;
    this.tags = tags;
    this.category = category;
    this.author = author;
    this.thumbnail = thumbnail;
    this.galleryImages = galleryImages;
    this.status = status;
    this.isPublished = isPublished;
    this.isFeatured = isFeatured;
    this.allowComments = allowComments;
    this.views = views;
    this.likes = likes;
    this.readingTime = readingTime;
    this.publishedAt = publishedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
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
      author: doc.author,
      thumbnail: doc.thumbnail,
      galleryImages: doc.galleryImages,
      status: doc.status,
      isPublished: doc.isPublished,
      isFeatured: doc.featured,
      allowComments: doc.allowComments,
      views: doc.views,
      likes: doc.likes,
      readingTime: doc.readingTime,
      publishedAt: doc.publishedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}

export default Blog;
