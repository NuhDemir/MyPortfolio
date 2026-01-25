import { generateSlug } from "../../../../shared/utils/slug.js";

const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim()).filter(Boolean);
  }

  return tags
    .toString()
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const pickDefined = (payload) =>
  Object.entries(payload).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});

const normalizeProjectResponse = (project) => {
  if (!project) return null;

  const title = project.title ?? project.metadata?.title;
  const description =
    project.description ??
    project.metadata?.tagline ??
    project.caseStudy?.problem?.description;
  const imageUrl = project.imageUrl ?? project.visuals?.thumbnailUrl;
  const isFeatured =
    project.isFeatured !== undefined ? project.isFeatured : project.featured;

  const links = {
    ...(project.links ?? {}),
    liveDemo: project.links?.liveDemo ?? project.liveUrl ?? undefined,
    github: project.links?.github ?? project.githubUrl ?? undefined,
  };

  return {
    ...project,
    title,
    description,
    imageUrl,
    tags: normalizeTags(project.tags),
    technologies: Array.isArray(project.technologies)
      ? project.technologies
      : [],
    techStack: Array.isArray(project.techStack) ? project.techStack : [],
    metadata: project.metadata ?? (title ? { title } : null),
    visuals: project.visuals ?? (imageUrl ? { thumbnailUrl: imageUrl } : null),
    links: Object.keys(links).length > 0 ? links : null,
    caseStudy: project.caseStudy ?? null,
    isFeatured,
    featured:
      project.featured !== undefined ? project.featured : Boolean(isFeatured),
    githubUrl: project.githubUrl ?? links.github,
    liveUrl: project.liveUrl ?? links.liveDemo,
  };
};

const pickProjectTitle = (data) => data?.title ?? data?.metadata?.title;
const pickProjectTagline = (data) => data?.metadata?.tagline;
const pickProjectThumbnailUrl = (data) =>
  data?.visuals?.thumbnailUrl ?? data?.imageUrl;

const normalizeProjectLinks = (data) => {
  const base =
    typeof data?.links === "object" && data.links !== null ? data.links : {};
  return {
    ...base,
    liveDemo: base.liveDemo ?? data?.liveUrl ?? undefined,
    github: base.github ?? data?.githubUrl ?? undefined,
    figma: base.figma ?? undefined,
  };
};

const normalizeProjectCreatePayload = (data) => {
  const title = pickProjectTitle(data);
  const tagline = pickProjectTagline(data);
  const thumbnailUrl = pickProjectThumbnailUrl(data);
  const isFeatured =
    data?.isFeatured !== undefined ? data.isFeatured : data?.featured;

  return {
    ...data,
    externalId: data?.externalId ?? data?.id,
    title,
    description:
      data?.description ??
      tagline ??
      data?.caseStudy?.problem?.description ??
      "",
    slug: data?.slug ?? (title ? generateSlug(title) : undefined),
    imageUrl: thumbnailUrl,
    visuals: {
      ...(data?.visuals ?? {}),
      thumbnailUrl,
    },
    metadata: {
      ...(data?.metadata ?? {}),
      title,
      tagline,
    },
    links: normalizeProjectLinks(data),
    tags: normalizeTags(data?.tags),
    featured: Boolean(isFeatured),
    isFeatured: Boolean(isFeatured),
  };
};

const normalizeProjectUpdatePayload = (data) => {
  const title = pickProjectTitle(data);
  const tagline = pickProjectTagline(data);
  const thumbnailUrl = pickProjectThumbnailUrl(data);
  const hasFeatured =
    data?.isFeatured !== undefined || data?.featured !== undefined;
  const isFeatured =
    data?.isFeatured !== undefined ? data.isFeatured : data?.featured;

  const payload = pickDefined({
    ...data,
    externalId: data?.externalId ?? data?.id,
    title,
    description: data?.description ?? (tagline ? tagline : undefined),
    imageUrl: thumbnailUrl,
    tags: data?.tags !== undefined ? normalizeTags(data.tags) : undefined,
    featured: hasFeatured ? Boolean(isFeatured) : undefined,
    isFeatured: hasFeatured ? Boolean(isFeatured) : undefined,
    githubUrl: data?.githubUrl,
    liveUrl: data?.liveUrl,
    metadata:
      data?.metadata !== undefined ||
      title !== undefined ||
      tagline !== undefined
        ? {
            ...(data?.metadata ?? {}),
            ...(title !== undefined ? { title } : {}),
            ...(tagline !== undefined ? { tagline } : {}),
          }
        : undefined,
    visuals:
      data?.visuals !== undefined || thumbnailUrl !== undefined
        ? {
            ...(data?.visuals ?? {}),
            ...(thumbnailUrl !== undefined ? { thumbnailUrl } : {}),
          }
        : undefined,
    links:
      data?.links !== undefined ||
      data?.githubUrl !== undefined ||
      data?.liveUrl !== undefined
        ? {
            ...(typeof data?.links === "object" && data.links !== null
              ? data.links
              : {}),
            ...(data?.githubUrl !== undefined
              ? { github: data.githubUrl }
              : {}),
            ...(data?.liveUrl !== undefined ? { liveDemo: data.liveUrl } : {}),
          }
        : undefined,
  });

  if (payload.title && !payload.slug) {
    payload.slug = generateSlug(payload.title);
  }

  return payload;
};

export class ProjectService {
  constructor({ projectRepository }) {
    this.projectRepository = projectRepository;
  }

  async listProjects(filters = {}) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.featured !== undefined) {
      if (filters.featured === true) {
        query.$or = [{ featured: true }, { isFeatured: true }];
      } else {
        query.$and = [
          {
            $or: [{ featured: false }, { featured: { $exists: false } }],
          },
          {
            $or: [{ isFeatured: false }, { isFeatured: { $exists: false } }],
          },
        ];
      }
    }

    const projects = await this.projectRepository.findAll(query, {
      lean: filters.lean ?? false,
    });

    return projects.map(normalizeProjectResponse);
  }

  async getProjectById(id, options = {}) {
    const project = await this.projectRepository.findById(id, options);

    if (!project) {
      throw new Error("Proje bulunamadı.");
    }

    return normalizeProjectResponse(project);
  }

  async getProjectBySlug(slug, options = {}) {
    const project = await this.projectRepository.findBySlug(slug, options);

    if (!project) {
      throw new Error("Proje bulunamadı.");
    }

    return normalizeProjectResponse(project);
  }

  async createProject(data) {
    const title = pickProjectTitle(data);

    if (!title) {
      throw new Error("Proje başlığı zorunludur.");
    }

    const payload = normalizeProjectCreatePayload(data);

    const created = await this.projectRepository.create(payload);
    return normalizeProjectResponse(created);
  }

  async updateProject(id, data) {
    const payload = normalizeProjectUpdatePayload(data);

    const updated = await this.projectRepository.updateById(id, payload);

    if (!updated) {
      throw new Error("Güncellenecek proje bulunamadı.");
    }

    return normalizeProjectResponse(updated);
  }

  async deleteProject(id) {
    const deleted = await this.projectRepository.deleteById(id);

    if (!deleted) {
      throw new Error("Silinecek proje bulunamadı.");
    }

    return deleted;
  }

  async incrementProjectViews(id) {
    const project = await this.projectRepository.incrementViews(id);

    if (!project) {
      throw new Error("Proje bulunamadı.");
    }

    return normalizeProjectResponse(project);
  }
}

export const createProjectService = ({ projectRepository }) =>
  new ProjectService({ projectRepository });

export default ProjectService;
