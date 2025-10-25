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

  return {
    ...project,
    tags: normalizeTags(project.tags),
    technologies: Array.isArray(project.technologies)
      ? project.technologies
      : [],
  };
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
      query.featured = filters.featured;
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
    if (!data?.title) {
      throw new Error("Proje başlığı zorunludur.");
    }

    const payload = {
      ...data,
      slug: data.slug ?? generateSlug(data.title),
      tags: normalizeTags(data.tags),
    };

    const created = await this.projectRepository.create(payload);
    return normalizeProjectResponse(created);
  }

  async updateProject(id, data) {
    const payload = pickDefined({
      ...data,
      tags: data.tags !== undefined ? normalizeTags(data.tags) : undefined,
    });

    if (payload.title && !payload.slug) {
      payload.slug = generateSlug(payload.title);
    }

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
