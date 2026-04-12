import { generateSlug } from "../../../../shared/utils/slug.js";
import { buildProjectListQuery } from "./projectListQueryBuilder.js";

const normalizeTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((t) => t.trim()).filter(Boolean);
  return String(tags).split(",").map((t) => t.trim()).filter(Boolean);
};

const pickDefined = (payload) =>
  Object.entries(payload).reduce((acc, [k, v]) => {
    if (v !== undefined) acc[k] = v;
    return acc;
  }, {});

/**
 * Resolves canonical fields from a raw input that may be in v1, v2, or v3 format.
 */
const resolveTitle    = (d) => d?.title ?? d?.metadata?.title;
const resolveTagline  = (d) => d?.tagline ?? d?.metadata?.tagline;
const resolveThumbnail = (d) => d?.visuals?.thumbnailUrl ?? d?.imageUrl;

const resolveLinks = (d) => {
  const base = typeof d?.links === "object" && d.links !== null ? d.links : {};
  return {
    liveDemo:      base.liveDemo      ?? d?.liveUrl,
    github:        base.github        ?? d?.githubUrl,
    figma:         base.figma,
    documentation: base.documentation,
  };
};

/**
 * Merges legacy `techStack` (grouped) and `technologies` (flat) into the
 * canonical flat `technologies` array.
 */
const resolveTechnologies = (d) => {
  const existing = Array.isArray(d?.technologies) ? d.technologies : [];
  if (existing.length > 0) return existing;

  if (Array.isArray(d?.techStack)) {
    return d.techStack.flatMap((group) =>
      (group.items || []).map((item) => ({
        name: item,
        category: (group.category || "other").toLowerCase(),
      })),
    );
  }
  return [];
};

/**
 * Merges legacy scattered context fields into the canonical `context` object.
 */
const resolveContext = (d) => ({
  role:             d?.context?.role             ?? d?.metadata?.role    ?? d?.role,
  teamSize:         d?.context?.teamSize         ?? d?.teamSize,
  platform:         d?.context?.platform         ?? d?.metadata?.platform ?? d?.platform,
  duration:         d?.context?.duration         ?? d?.duration,
  startDate:        d?.context?.startDate        ?? d?.startDate,
  endDate:          d?.context?.endDate          ?? d?.endDate,
  difficulty:       d?.context?.difficulty       ?? d?.difficulty,
  repositoryAccess: d?.context?.repositoryAccess,
  architecture:     d?.context?.architecture,
});

const normalizeProjectResponse = (project) => {
  if (!project) return null;

  const title        = resolveTitle(project);
  const tagline      = resolveTagline(project);
  const description  = project.description ?? tagline ?? project.caseStudy?.problem?.description;
  const thumbnailUrl = resolveThumbnail(project);
  const isFeatured   = project.isFeatured ?? project.featured ?? false;
  const technologies = resolveTechnologies(project);
  const context      = resolveContext(project);
  const links        = resolveLinks(project);

  return {
    ...project,
    title,
    tagline,
    description,
    isFeatured,
    featured: isFeatured, // keep shim populated
    tags: normalizeTags(project.tags),
    technologies,
    techStack: project.techStack ?? [], // keep shim
    context,
    visuals: {
      ...(project.visuals ?? {}),
      thumbnailUrl: thumbnailUrl ?? project.visuals?.thumbnailUrl,
    },
    imageUrl: thumbnailUrl, // keep shim
    links: Object.values(links).some(Boolean) ? links : null,
    // keep legacy shims populated for old consumers
    githubUrl: project.githubUrl ?? links.github,
    liveUrl:   project.liveUrl   ?? links.liveDemo,
    metadata: project.metadata ?? (title ? { title, tagline } : null),
  };
};

const normalizeProjectCreatePayload = (data) => {
  const title        = resolveTitle(data);
  const tagline      = resolveTagline(data);
  const thumbnailUrl = resolveThumbnail(data);
  const isFeatured   = data?.isFeatured ?? data?.featured ?? false;
  const context      = resolveContext(data);
  const technologies = resolveTechnologies(data);

  return {
    ...data,
    externalId: data?.externalId ?? data?.id,
    title,
    tagline,
    description: data?.description ?? tagline ?? data?.caseStudy?.problem?.description ?? "",
    slug:        data?.slug ?? (title ? generateSlug(title) : undefined),
    imageUrl:    thumbnailUrl,
    visuals: {
      ...(data?.visuals ?? {}),
      thumbnailUrl,
    },
    metadata: {
      ...(data?.metadata ?? {}),
      title,
      tagline,
    },
    context,
    technologies,
    links:        resolveLinks(data),
    tags:         normalizeTags(data?.tags),
    isFeatured:   Boolean(isFeatured),
    featured:     Boolean(isFeatured),
  };
};

const normalizeProjectUpdatePayload = (data) => {
  const title        = resolveTitle(data);
  const tagline      = resolveTagline(data);
  const thumbnailUrl = resolveThumbnail(data);
  const hasFeatured  = data?.isFeatured !== undefined || data?.featured !== undefined;
  const isFeatured   = data?.isFeatured ?? data?.featured;

  const payload = pickDefined({
    ...data,
    externalId:  data?.externalId ?? data?.id,
    title,
    tagline,
    description: data?.description ?? (tagline ? tagline : undefined),
    imageUrl:    thumbnailUrl,
    tags:        data?.tags !== undefined ? normalizeTags(data.tags) : undefined,
    isFeatured:  hasFeatured ? Boolean(isFeatured) : undefined,
    featured:    hasFeatured ? Boolean(isFeatured) : undefined,
    // technologies: merge if provided
    technologies:
      data?.technologies !== undefined || data?.techStack !== undefined
        ? resolveTechnologies(data)
        : undefined,
    // context: deep-merge if any context-related field present
    context:
      data?.context !== undefined ||
      data?.metadata?.role !== undefined ||
      data?.metadata?.platform !== undefined ||
      data?.duration !== undefined
        ? resolveContext(data)
        : undefined,
    visuals:
      data?.visuals !== undefined || thumbnailUrl !== undefined
        ? { ...(data?.visuals ?? {}), ...(thumbnailUrl ? { thumbnailUrl } : {}) }
        : undefined,
    metadata:
      data?.metadata !== undefined || title !== undefined || tagline !== undefined
        ? {
            ...(data?.metadata ?? {}),
            ...(title   !== undefined ? { title }   : {}),
            ...(tagline !== undefined ? { tagline }  : {}),
          }
        : undefined,
    links:
      data?.links !== undefined ||
      data?.githubUrl !== undefined ||
      data?.liveUrl !== undefined
        ? resolveLinks(data)
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
    const query = buildProjectListQuery(filters);
    const projects = await this.projectRepository.findAll(query, {
      lean: filters.lean ?? false,
    });
    return projects.map(normalizeProjectResponse);
  }

  async getProjectById(id, options = {}) {
    const project = await this.projectRepository.findById(id, options);
    if (!project) throw new Error("Proje bulunamadı.");
    return normalizeProjectResponse(project);
  }

  async getProjectBySlug(slug, options = {}) {
    const project = await this.projectRepository.findBySlug(slug, options);
    if (!project) throw new Error("Proje bulunamadı.");
    return normalizeProjectResponse(project);
  }

  async createProject(data) {
    const title = resolveTitle(data);
    if (!title) throw new Error("Proje başlığı zorunludur.");
    const payload = normalizeProjectCreatePayload(data);
    const created = await this.projectRepository.create(payload);
    return normalizeProjectResponse(created);
  }

  async updateProject(id, data) {
    const payload = normalizeProjectUpdatePayload(data);
    const updated = await this.projectRepository.updateById(id, payload);
    if (!updated) throw new Error("Güncellenecek proje bulunamadı.");
    return normalizeProjectResponse(updated);
  }

  async deleteProject(id) {
    const deleted = await this.projectRepository.deleteById(id);
    if (!deleted) throw new Error("Silinecek proje bulunamadı.");
    return deleted;
  }

  async incrementProjectViews(id) {
    const project = await this.projectRepository.incrementViews(id);
    if (!project) throw new Error("Proje bulunamadı.");
    return normalizeProjectResponse(project);
  }
}

export const createProjectService = ({ projectRepository }) =>
  new ProjectService({ projectRepository });

export default ProjectService;
