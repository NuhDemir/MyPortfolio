import { generateSlug } from "../../../../shared/utils/slug.js";

export class ResourceService {
  constructor({ resourceRepository }) {
    this.resourceRepository = resourceRepository;
  }

  async ensureUniqueSlug(rawSlug, excludeId = null) {
    if (!rawSlug) {
      return generateSlug(
        `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      );
    }

    const baseSlug = generateSlug(rawSlug);
    let candidate = baseSlug;
    let attempt = 1;
    const existingSlugs = new Set();

    if (excludeId) {
      const all = await this.resourceRepository.findAll({});
      all.forEach((r) => {
        if (r.id !== excludeId) existingSlugs.add(r.slug);
      });
    }

    if (existingSlugs.size > 0) {
      while (existingSlugs.has(candidate)) {
        candidate = generateSlug(`${baseSlug}-${attempt}`);
        attempt += 1;
      }
    } else {
      while (await this.resourceRepository.findBySlug(candidate)) {
        candidate = generateSlug(`${baseSlug}-${attempt}`);
        attempt += 1;
      }
    }

    return candidate;
  }

  async listResources({ isAdmin = false, filters = {} } = {}) {
    const filter = isAdmin ? {} : { isActive: true };

    if (filters.type) filter.type = filters.type;
    if (filters.tag) filter.tags = filters.tag;
    if (filters.language) filter.language = filters.language;
    if (filters.difficulty) filter.difficulty = filters.difficulty;
    if (filters.featured !== undefined) filter.isFeatured = filters.featured === "true" || filters.featured === true;

    return this.resourceRepository.findAll(filter);
  }

  async getResourceBySlug(slug, { isAdmin = false } = {}) {
    const filter = isAdmin ? {} : { isActive: true };
    let resource = await this.resourceRepository.findBySlug(slug);

    if (!resource) {
      const fallback = await this.resourceRepository.findById(slug);
      if (fallback && (isAdmin || fallback.isActive)) {
        resource = fallback;
      }
    }

    if (!resource) {
      throw new Error("Kaynak bulunamadı.");
    }

    return resource;
  }

  async createResource(data) {
    const payload = {
      ...data,
      tags: Array.isArray(data.tags)
        ? data.tags
        : (data.tags ?? "")
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
    };

    if (payload.rating !== undefined) {
      payload.rating = Math.min(5, Math.max(0, Number(payload.rating) || 0));
    }

    payload.slug = await this.ensureUniqueSlug(data.slug ?? data.title);

    return this.resourceRepository.create(payload);
  }

  async updateResource(id, data) {
    const payload = { ...data };

    if (payload.title && !payload.slug) {
      payload.slug = payload.title;
    }

    if (payload.slug) {
      payload.slug = await this.ensureUniqueSlug(payload.slug, id);
    }

    if (payload.tags && typeof payload.tags === "string") {
      payload.tags = payload.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    if (payload.rating !== undefined) {
      payload.rating = Math.min(5, Math.max(0, Number(payload.rating) || 0));
    }

    const updated = await this.resourceRepository.updateById(id, payload);

    if (!updated) {
      throw new Error("Kaynak bulunamadı.");
    }

    return updated;
  }

  async deleteResource(id) {
    const result = await this.resourceRepository.deleteById(id);
    if (!result) {
      throw new Error("Kaynak bulunamadı.");
    }
    return result;
  }
}

export const createResourceService = ({ resourceRepository }) =>
  new ResourceService({ resourceRepository });

export default ResourceService;
