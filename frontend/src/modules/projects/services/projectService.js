import axiosClient from "@core/http/axiosClient";
import projectExportsRaw from "@modules/projects/data/projectData.json";
import developerProjectsRaw from "@shared/data/developerProjects.json";

const REQUEST_TIMEOUT_MS = 2800;

const normalizeFilterValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
};

const normalizeText = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim().toLowerCase();
};

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const resolveProjectEntries = (payload) => {
  if (Array.isArray(payload)) {
    return payload.flatMap((entry) => {
      if (entry && Array.isArray(entry.items)) {
        return entry.items;
      }
      return entry && typeof entry === "object" ? [entry] : [];
    });
  }

  if (payload && typeof payload === "object" && Array.isArray(payload.items)) {
    return payload.items;
  }

  return [];
};

const normalizeProjectPayload = (project) => {
  if (!project || typeof project !== "object") {
    return null;
  }

  const title =
    project?.metadata?.title || project?.title || "Untitled Project";
  const description =
    project?.metadata?.tagline ||
    project?.description ||
    project?.excerpt ||
    "";

  const tags = Array.isArray(project?.tags)
    ? project.tags
    : Array.isArray(project?.technologies)
      ? project.technologies
          .map((item) => (typeof item === "string" ? item : item?.name))
          .filter(Boolean)
      : [];

  const liveDemo = project?.links?.liveDemo || project?.liveUrl || "";
  const github = project?.links?.github || project?.githubUrl || "";
  const figma = project?.links?.figma || project?.figmaUrl || "";

  const metadata = {
    title,
    tagline: description,
    role: project?.metadata?.role || project?.role || "",
    platform: project?.metadata?.platform || project?.platform || "",
    status: project?.metadata?.status || project?.status || "",
    createdAt: project?.metadata?.createdAt || project?.createdAt || "",
  };

  return {
    ...project,
    id: project.id || project._id || project.externalId || slugify(title),
    slug: project.slug || slugify(title),
    title,
    description,
    metadata,
    visuals: {
      ...(project.visuals || {}),
      thumbnailUrl: project?.visuals?.thumbnailUrl || project?.imageUrl || "",
    },
    links: {
      ...(project.links || {}),
      liveDemo,
      github,
      figma,
    },
    tags,
    status: normalizeText(project.status || metadata.status) || "active",
    featured: project?.featured === true || project?.isFeatured === true,
    isFeatured: project?.isFeatured === true || project?.featured === true,
  };
};

const dedupeProjects = (list) => {
  const map = new Map();

  list.forEach((project) => {
    const key =
      normalizeText(project?.id) ||
      normalizeText(project?.slug) ||
      normalizeText(project?.title);

    if (!key) {
      return;
    }

    if (!map.has(key)) {
      map.set(key, project);
    }
  });

  return Array.from(map.values());
};

const toBooleanOrUndefined = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  const normalized = normalizeText(value);
  if (["true", "1", "yes", "on"].includes(normalized)) {
    return true;
  }
  if (["false", "0", "no", "off"].includes(normalized)) {
    return false;
  }

  return undefined;
};

const normalizeProjectFilters = (filters = {}) => ({
  q: normalizeFilterValue(filters.q || filters.search),
  status: normalizeFilterValue(filters.status),
  platform: normalizeFilterValue(filters.platform),
  tag: normalizeFilterValue(filters.tag),
  featured: toBooleanOrUndefined(filters.featured),
});

const matchesSearch = (project, queryText) => {
  if (!queryText) return true;

  const term = normalizeText(queryText);
  const haystack = [
    project?.title,
    project?.slug,
    project?.description,
    project?.excerpt,
    project?.category,
    project?.status,
    project?.platform,
    project?.metadata?.title,
    project?.metadata?.tagline,
    project?.metadata?.platform,
    project?.metadata?.status,
    ...(Array.isArray(project?.tags) ? project.tags : []),
  ]
    .map((item) => normalizeText(item))
    .filter(Boolean)
    .join(" ");

  return haystack.includes(term);
};

const applyProjectFilters = (projects, filters = {}) => {
  const normalized = normalizeProjectFilters(filters);

  return projects.filter((project) => {
    if (normalized.status && normalized.status.toLowerCase() !== "all") {
      const statusCandidate = normalizeText(
        project?.status || project?.metadata?.status,
      );
      if (statusCandidate !== normalizeText(normalized.status)) {
        return false;
      }
    }

    if (normalized.platform && normalized.platform.toLowerCase() !== "all") {
      const platformCandidate = normalizeText(
        project?.platform || project?.metadata?.platform,
      );
      if (!platformCandidate.includes(normalizeText(normalized.platform))) {
        return false;
      }
    }

    if (normalized.tag) {
      const tags = Array.isArray(project?.tags) ? project.tags : [];
      const tagMatches = tags.some((tag) =>
        normalizeText(tag).includes(normalizeText(normalized.tag)),
      );
      if (!tagMatches) {
        return false;
      }
    }

    if (normalized.featured !== undefined) {
      const isFeatured =
        project?.featured === true || project?.isFeatured === true;
      if (isFeatured !== normalized.featured) {
        return false;
      }
    }

    return matchesSearch(project, normalized.q);
  });
};

const buildQueryParams = (filters = {}) => {
  const normalized = normalizeProjectFilters(filters);
  const params = {};

  if (normalized.q) params.q = normalized.q;
  if (normalized.status && normalized.status.toLowerCase() !== "all") {
    params.status = normalized.status;
  }
  if (normalized.platform && normalized.platform.toLowerCase() !== "all") {
    params.platform = normalized.platform;
  }
  if (normalized.tag) params.tag = normalized.tag;
  if (normalized.featured !== undefined) {
    params.featured = String(normalized.featured);
  }

  return params;
};

const normalizeProjectCollection = (payload) =>
  dedupeProjects(
    resolveProjectEntries(payload).map(normalizeProjectPayload).filter(Boolean),
  );

export const FALLBACK_PROJECTS = dedupeProjects([
  ...normalizeProjectCollection(projectExportsRaw),
  ...normalizeProjectCollection(developerProjectsRaw),
]);

const matchesProjectParam = (project, id) => {
  const needle = normalizeText(id);
  if (!needle) {
    return false;
  }

  return [project?.id, project?._id, project?.externalId, project?.slug].some(
    (candidate) => normalizeText(candidate) === needle,
  );
};

export const fetchProjects = async (options = {}) => {
  const { signal, filters = {}, includeSource = false } = options;
  const params = buildQueryParams(filters);

  const toResult = (items, source) =>
    includeSource ? { items, source } : items;

  try {
    const response = await axiosClient.get("/projects", {
      timeout: REQUEST_TIMEOUT_MS,
      signal,
      params,
    });
    const projects = normalizeProjectCollection(response.data);
    const normalizedItems = projects.length > 0 ? projects : FALLBACK_PROJECTS;
    const filteredItems = applyProjectFilters(normalizedItems, filters);
    return toResult(filteredItems, projects.length > 0 ? "live" : "fallback");
  } catch {
    const filteredFallback = applyProjectFilters(FALLBACK_PROJECTS, filters);
    return toResult(filteredFallback, "fallback");
  }
};

export const fetchProjectById = async (id, options = {}) => {
  const { signal } = options;

  try {
    const response = await axiosClient.get(`/projects/${id}`, {
      timeout: REQUEST_TIMEOUT_MS,
      signal,
    });
    const project = normalizeProjectPayload(response.data);
    if (project) {
      return project;
    }
  } catch {
    // No-op: fallback below
  }

  const found = FALLBACK_PROJECTS.find((item) => matchesProjectParam(item, id));
  return found || null;
};

export default {
  fetchProjects,
  fetchProjectById,
};
