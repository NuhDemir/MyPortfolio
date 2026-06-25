export class Resource {
  constructor({
    id,
    title,
    slug,
    description = "",
    url,
    type = "diger",
    tags = [],
    coverImage = null,
    author = "",
    rating = 0,
    language = "tr",
    difficulty = null,
    notes = "",
    isActive = true,
    isFeatured = false,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this.title = title;
    this.slug = slug;
    this.description = description;
    this.url = url;
    this.type = type;
    this.tags = tags;
    this.coverImage = coverImage;
    this.author = author;
    this.rating = rating;
    this.language = language;
    this.difficulty = difficulty;
    this.notes = notes;
    this.isActive = isActive;
    this.isFeatured = isFeatured;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(model) {
    if (!model) return null;

    const doc = typeof model.toObject === "function" ? model.toObject() : model;

    return new Resource({
      id: doc._id?.toString?.() ?? doc.id,
      title: doc.title,
      slug: doc.slug,
      description: doc.description,
      url: doc.url,
      type: doc.type,
      tags: doc.tags,
      coverImage: doc.coverImage,
      author: doc.author,
      rating: doc.rating,
      language: doc.language,
      difficulty: doc.difficulty,
      notes: doc.notes,
      isActive: doc.isActive,
      isFeatured: doc.isFeatured,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}

export default Resource;
