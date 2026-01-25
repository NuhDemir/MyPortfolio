export const initialProjectFormState = {
  id: "",
  slug: "",
  isFeatured: false,
  metadataTitle: "",
  metadataTagline: "",
  metadataCreatedAt: "",
  metadataRole: "",
  metadataPlatform: "",
  metadataStatus: "",
  visualsThumbnailUrl: "",
  visualsHeroVideoUrl: "",
  visualsPrimaryColor: "#111111",
  linksLiveDemo: "",
  linksGithub: "",
  linksFigma: "",
  techStackJson: "",
  caseStudyJson: "",
  tags: "",
  category: "",
};

export const resolveProjectId = (project) => project?.id ?? project?._id ?? "";

export const getDisplayTitle = (project) =>
  project?.metadata?.title ?? project?.title ?? "";

export const getDisplayThumbnail = (project) =>
  project?.visuals?.thumbnailUrl ?? project?.imageUrl ?? null;

export const normalizeTags = (value) => {
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

export const normalizeTechnologies = (value) => {
  if (!value) return undefined;

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    if (value.every((entry) => typeof entry === "string")) {
      return value.map((name) => ({ name }));
    }
    return value;
  }

  return value;
};

export const normalizeProjectJson = (input) => {
  const project = input && typeof input === "object" ? input : {};

  const isV2Payload =
    Boolean(project?.metadata) ||
    Boolean(project?.visuals) ||
    Boolean(project?.techStack) ||
    Boolean(project?.links) ||
    Boolean(project?.caseStudy) ||
    project?.isFeatured !== undefined;

  if (isV2Payload) {
    const title =
      project?.metadata?.title ?? project.title ?? project.name ?? "";
    const tagline =
      project?.metadata?.tagline ??
      project.description ??
      project.summary ??
      "";

    const thumbnailUrl =
      project?.visuals?.thumbnailUrl ??
      project.imageUrl ??
      project.image ??
      project.thumbnailUrl ??
      "";

    const submission = {
      id: project.id,
      slug: project.slug,
      isFeatured: project.isFeatured ?? project.featured,
      metadata: {
        ...(project.metadata && typeof project.metadata === "object"
          ? project.metadata
          : {}),
        title,
        tagline,
      },
      visuals: {
        ...(project.visuals && typeof project.visuals === "object"
          ? project.visuals
          : {}),
        thumbnailUrl,
      },
      links: {
        ...(project.links && typeof project.links === "object"
          ? project.links
          : {}),
        github:
          project?.links?.github ?? project.githubUrl ?? project.github ?? "",
        liveDemo:
          project?.links?.liveDemo ?? project.liveUrl ?? project.url ?? "",
        figma: project?.links?.figma ?? project.figmaUrl ?? "",
      },
      techStack: project.techStack,
      caseStudy: project.caseStudy,
    };

    const tags = normalizeTags(project.tags);
    if (tags.length > 0) submission.tags = tags;
    if (project.category) submission.category = project.category;
    if (project.status) submission.status = project.status;

    Object.keys(submission.links).forEach((key) => {
      if (!submission.links[key]) delete submission.links[key];
    });

    if (submission.visuals) {
      Object.keys(submission.visuals).forEach((key) => {
        if (!submission.visuals[key]) delete submission.visuals[key];
      });
    }

    Object.keys(submission).forEach((key) => {
      if (submission[key] === undefined) delete submission[key];
    });

    return submission;
  }

  const submission = {
    title: project.title ?? project.name ?? "",
    description: project.description ?? project.summary ?? "",
    githubUrl: project.githubUrl ?? project.github ?? "",
    liveUrl: project.liveUrl ?? project.url ?? "",
    imageUrl: project.imageUrl ?? project.image ?? project.thumbnailUrl ?? "",
    tags: normalizeTags(project.tags),
    category: project.category,
    featured: project.featured,
    status: project.status,
    priority: project.priority,
    difficulty: project.difficulty,
    duration: project.duration,
    startDate: project.startDate,
    endDate: project.endDate,
    technologies: normalizeTechnologies(project.technologies),
    metrics: project.metrics,
    client: project.client,
    seo: project.seo,
  };

  Object.keys(submission).forEach((key) => {
    if (submission[key] === undefined) {
      delete submission[key];
    }
  });

  if (!Array.isArray(submission.tags) || submission.tags.length === 0) {
    delete submission.tags;
  }

  if (!submission.githubUrl) {
    delete submission.githubUrl;
  }

  if (!submission.liveUrl) {
    delete submission.liveUrl;
  }

  return submission;
};
