/**
 * Project Domain Entity
 *
 * Canonical fields (v3 schema):
 *   - Identity  : externalId, title, slug, tagline, excerpt, description
 *   - Class     : category, status, isFeatured, priority, tags
 *   - Context   : context.{ role, teamSize, platform, duration, startDate, endDate,
 *                            difficulty, repositoryAccess, architecture }
 *   - Visuals   : visuals.{ thumbnailUrl, heroImageUrl, heroVideoUrl, ogImage,
 *                            primaryColor, accentColor,
 *                            architectureDiagramUrl, wireframeUrl,
 *                            beforeImageUrl, afterImageUrl }
 *   - Tech      : technologies[].{ name, category, proficiency }
 *   - Links     : links.{ liveDemo, github, figma, documentation }
 *   - Gallery   : galleryImages[].{ url, alt, caption, type }
 *   - Case Study: caseStudy.{ problem, solution, impact, highlights[],
 *                              challenges[], metrics[].{ label, value, unit },
 *                              highlightCode, gallery[] }
 *   - Engagement: views, likes
 *   - SEO       : seo.{ title, description, keywords[] }
 *   - Client    : client.{ name, website, testimonial }
 *   - Dev Metrics: metrics.{ codeLines, commits, contributors, testCoverage, deployments }
 *
 * Backward-compat shims (kept for existing DB docs — populated by pre-validate hook):
 *   imageUrl, metadata, featured, techStack, githubUrl, liveUrl,
 *   duration, startDate, endDate, difficulty, shares
 */
export class Project {
  constructor({
    // Identity
    id,
    externalId,
    title,
    slug,
    tagline,
    description,
    excerpt,

    // Classification
    category,
    status = "active",
    isFeatured = false,
    priority = 5,
    tags = [],

    // Developer context
    context = {},

    // Visuals (consolidated)
    visuals = null,

    // Technologies (merged techStack + technologies)
    technologies = [],

    // Links
    links = null,

    // Gallery
    galleryImages = [],

    // Case study
    caseStudy = null,

    // Engagement
    views = 0,
    likes = 0,

    // SEO
    seo = {},

    // Client
    client = {},

    // Dev metrics
    metrics = {},

    // Timestamps
    createdAt,
    updatedAt,

    // ── Backward-compat shims ──────────────────────────────
    imageUrl,     // → visuals.thumbnailUrl
    metadata,     // → tagline / context.role / context.platform
    featured,     // → isFeatured
    techStack,    // → technologies (grouped display format)
    githubUrl,    // → links.github
    liveUrl,      // → links.liveDemo
    duration,     // → context.duration
    startDate,    // → context.startDate
    endDate,      // → context.endDate
    difficulty,   // → context.difficulty
    shares,       // deprecated
  }) {
    this.id = id;
    this.externalId = externalId;
    this.title = title;
    this.slug = slug;
    this.tagline = tagline;
    this.description = description;
    this.excerpt = excerpt;
    this.category = category;
    this.status = status;
    this.isFeatured = isFeatured;
    this.priority = priority;
    this.tags = tags;
    this.context = context;
    this.visuals = visuals;
    this.technologies = technologies;
    this.links = links;
    this.galleryImages = galleryImages;
    this.caseStudy = caseStudy;
    this.views = views;
    this.likes = likes;
    this.seo = seo;
    this.client = client;
    this.metrics = metrics;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    // backward-compat shims — populated by pre-validate hook for existing DB docs
    this.imageUrl = imageUrl;
    this.metadata = metadata;
    this.featured = featured;
    this.techStack = techStack;
    this.githubUrl = githubUrl;
    this.liveUrl = liveUrl;
    this.duration = duration;
    this.startDate = startDate;
    this.endDate = endDate;
    this.difficulty = difficulty;
    this.shares = shares;
  }

  /**
   * Returns only summary fields suitable for list views.
   * Avoids sending heavy fields (description, caseStudy, galleryImages) over the wire.
   */
  toSummary() {
    return {
      id: this.id,
      externalId: this.externalId,
      title: this.title,
      slug: this.slug,
      tagline: this.tagline,
      excerpt: this.excerpt,
      category: this.category,
      status: this.status,
      isFeatured: this.isFeatured,
      priority: this.priority,
      tags: this.tags,
      context: this.context
        ? {
            role: this.context.role,
            platform: this.context.platform,
            architecture: this.context.architecture,
            repositoryAccess: this.context.repositoryAccess,
            duration: this.context.duration,
            difficulty: this.context.difficulty,
          }
        : {},
      visuals: this.visuals
        ? {
            thumbnailUrl: this.visuals.thumbnailUrl,
            primaryColor: this.visuals.primaryColor,
            accentColor: this.visuals.accentColor,
          }
        : null,
      technologies: Array.isArray(this.technologies)
        ? this.technologies.map(({ name, category, proficiency }) => ({
            name,
            category,
            proficiency,
          }))
        : [],
      links: this.links,
      views: this.views,
      likes: this.likes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  /**
   * Constructs a Project entity from a raw MongoDB document.
   * Handles both v3 (new) and legacy (v1/v2) document shapes.
   */
  static fromPersistence(model) {
    if (!model) return null;

    const doc = typeof model.toObject === "function" ? model.toObject() : model;

    // ── Resolve canonical fields from new OR legacy shapes ──────────────

    const title = doc.title ?? doc.metadata?.title;
    const tagline = doc.tagline ?? doc.metadata?.tagline;
    const description = doc.description ?? doc.metadata?.tagline ?? "";
    const imageUrl = doc.imageUrl ?? doc.visuals?.thumbnailUrl;
    const isFeatured = doc.isFeatured ?? doc.featured ?? false;

    // Context: prefer new `context` object, fall back to legacy scattered fields
    const context = {
      role:             doc.context?.role           ?? doc.metadata?.role       ?? doc.role,
      teamSize:         doc.context?.teamSize        ?? doc.teamSize,
      platform:         doc.context?.platform       ?? doc.metadata?.platform   ?? doc.platform,
      duration:         doc.context?.duration       ?? doc.duration,
      startDate:        doc.context?.startDate      ?? doc.startDate,
      endDate:          doc.context?.endDate        ?? doc.endDate,
      difficulty:       doc.context?.difficulty     ?? doc.difficulty,
      repositoryAccess: doc.context?.repositoryAccess,
      architecture:     doc.context?.architecture,
    };

    // Technologies: prefer unified `technologies`, fall back to flattening `techStack`
    let technologies = Array.isArray(doc.technologies) ? doc.technologies : [];
    if (technologies.length === 0 && Array.isArray(doc.techStack)) {
      technologies = doc.techStack.flatMap((group) =>
        (group.items || []).map((item) => ({
          name: item,
          category: (group.category || "other").toLowerCase(),
        })),
      );
    }

    // Links: prefer `links`, fall back to legacy fields
    const rawLinks = {
      liveDemo:      doc.links?.liveDemo      ?? doc.liveUrl,
      github:        doc.links?.github        ?? doc.githubUrl,
      figma:         doc.links?.figma,
      documentation: doc.links?.documentation,
    };
    const hasLinks = Object.values(rawLinks).some(Boolean);

    return new Project({
      id:           doc._id?.toString?.() ?? doc.id,
      externalId:   doc.externalId,
      title,
      slug:         doc.slug,
      tagline,
      description,
      excerpt:      doc.excerpt,
      category:     doc.category,
      status:       doc.status,
      isFeatured,
      priority:     doc.priority,
      tags:         doc.tags,
      context,
      visuals:      doc.visuals ?? (imageUrl ? { thumbnailUrl: imageUrl } : null),
      technologies,
      links:        hasLinks ? rawLinks : null,
      galleryImages: doc.galleryImages,
      caseStudy:    doc.caseStudy,
      views:        doc.views,
      likes:        doc.likes,
      seo:          doc.seo,
      client:       doc.client,
      metrics:      doc.metrics,
      createdAt:    doc.createdAt,
      updatedAt:    doc.updatedAt,
      // shims
      imageUrl,
      metadata:     doc.metadata,
      featured:     doc.featured,
      techStack:    doc.techStack,
      githubUrl:    doc.githubUrl,
      liveUrl:      doc.liveUrl,
      duration:     doc.duration,
      startDate:    doc.startDate,
      endDate:      doc.endDate,
      difficulty:   doc.difficulty,
      shares:       doc.shares,
    });
  }
}

export default Project;
