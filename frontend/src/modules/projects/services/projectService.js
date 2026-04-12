import axiosClient from "@core/http/axiosClient";
import projectExportsRaw from "@modules/projects/data/projectData.json";
import developerProjectsRaw from "@shared/data/developerProjects.json";

const REQUEST_TIMEOUT_MS = 2800;

// ── Utilities ─────────────────────────────────────────────────────────────

const normalizeFilterValue = (value) =>
  value == null ? "" : String(value).trim();

const normalizeText = (value) =>
  value == null ? "" : String(value).trim().toLowerCase();

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

// ── Payload resolution ────────────────────────────────────────────────────

const resolveTitle    = (p) => p?.title    ?? p?.metadata?.title;
const resolveTagline  = (p) => p?.tagline  ?? p?.metadata?.tagline ?? p?.description ?? p?.excerpt;
const resolveThumbnail = (p) => p?.visuals?.thumbnailUrl ?? p?.imageUrl;

const resolveLinks = (p) => ({
  liveDemo:      p?.links?.liveDemo      ?? p?.liveUrl   ?? "",
  github:        p?.links?.github        ?? p?.githubUrl ?? "",
  figma:         p?.links?.figma         ?? p?.figmaUrl  ?? "",
  documentation: p?.links?.documentation ?? "",
});

/**
 * Canonical tags = project.tags.
 * Fallback: flatten technologies names if tags absent.
 */
const resolveTags = (p) => {
  if (Array.isArray(p?.tags) && p.tags.length > 0) return p.tags;
  if (Array.isArray(p?.technologies)) {
    return p.technologies
      .map((item) => (typeof item === "string" ? item : item?.name))
      .filter(Boolean);
  }
  return [];
};

/**
 * Returns a flat array of technology names for display.
 * Prefers unified `technologies`, falls back to `techStack` groups.
 */
const resolveTechList = (p) => {
  if (Array.isArray(p?.technologies) && p.technologies.length > 0) {
    return p.technologies
      .map((item) => (typeof item === "string" ? item : item?.name))
      .filter(Boolean);
  }
  if (Array.isArray(p?.techStack)) {
    return p.techStack.flatMap((group) => group?.items ?? []).filter(Boolean);
  }
  return [];
};

/**
 * Resolves the canonical `context` object from v3 or legacy shapes.
 */
const resolveContext = (p) => ({
  role:             p?.context?.role             ?? p?.metadata?.role     ?? p?.role     ?? "",
  teamSize:         p?.context?.teamSize         ?? p?.teamSize,
  platform:         p?.context?.platform         ?? p?.metadata?.platform ?? p?.platform ?? "",
  duration:         p?.context?.duration         ?? p?.duration           ?? "",
  startDate:        p?.context?.startDate        ?? p?.startDate          ?? "",
  endDate:          p?.context?.endDate          ?? p?.endDate            ?? "",
  difficulty:       p?.context?.difficulty       ?? p?.difficulty         ?? "",
  repositoryAccess: p?.context?.repositoryAccess ?? "",
  architecture:     p?.context?.architecture     ?? "",
});

// ── Entry resolution (handles both flat and wrapped API shapes) ───────────

const resolveProjectEntries = (payload) => {
  if (Array.isArray(payload)) {
    return payload.flatMap((entry) => {
      if (entry && Array.isArray(entry.items)) return entry.items;
      return entry && typeof entry === "object" ? [entry] : [];
    });
  }
  if (payload && typeof payload === "object" && Array.isArray(payload.items)) {
    return payload.items;
  }
  return [];
};

// ── Normalize a single project payload ───────────────────────────────────

const normalizeProjectPayload = (project) => {
  if (!project || typeof project !== "object") return null;

  const title       = resolveTitle(project)    || "Untitled Project";
  const tagline     = resolveTagline(project)  || "";
  const thumbnailUrl = resolveThumbnail(project) || "";
  const links       = resolveLinks(project);
  const context     = resolveContext(project);
  const tags        = resolveTags(project);

  return {
    ...project,
    id:      project.id || project._id || project.externalId || slugify(title),
    slug:    project.slug || slugify(title),
    title,
    tagline,
    description: tagline,
    context,
    visuals: {
      ...(project.visuals || {}),
      thumbnailUrl,
    },
    links,
    tags,
    status:     normalizeText(project.status || context.status) || "active",
    isFeatured: project?.isFeatured === true || project?.featured === true,
    featured:   project?.isFeatured === true || project?.featured === true,
    // keep legacy shims populated
    imageUrl:   thumbnailUrl,
    metadata: {
      title,
      tagline,
      role:      context.role,
      platform:  context.platform,
      status:    normalizeText(project.status) || "active",
      createdAt: project?.metadata?.createdAt || project?.createdAt || "",
    },
  };
};

// ── Deduplication ─────────────────────────────────────────────────────────

const dedupeProjects = (list) => {
  const map = new Map();
  list.forEach((project) => {
    const key =
      normalizeText(project?.id) ||
      normalizeText(project?.slug) ||
      normalizeText(project?.title);
    if (!key) return;
    if (!map.has(key)) map.set(key, project);
  });
  return Array.from(map.values());
};

// ── Filter helpers ────────────────────────────────────────────────────────

const toBooleanOrUndefined = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "boolean") return value;
  const n = normalizeText(value);
  if (["true", "1", "yes", "on"].includes(n)) return true;
  if (["false", "0", "no", "off"].includes(n)) return false;
  return undefined;
};

const normalizeProjectFilters = (filters = {}) => ({
  q:               normalizeFilterValue(filters.q || filters.search),
  status:          normalizeFilterValue(filters.status),
  platform:        normalizeFilterValue(filters.platform),
  architecture:    normalizeFilterValue(filters.architecture),
  repositoryAccess: normalizeFilterValue(filters.repositoryAccess),
  category:        normalizeFilterValue(filters.category),
  tag:             normalizeFilterValue(filters.tag),
  featured:        toBooleanOrUndefined(filters.featured),
});

const matchesSearch = (project, queryText) => {
  if (!queryText) return true;

  const term = normalizeText(queryText);
  const techList = resolveTechList(project);
  const haystack = [
    project?.title,
    project?.slug,
    project?.tagline,
    project?.description,
    project?.excerpt,
    project?.category,
    project?.status,
    project?.context?.platform,
    project?.context?.role,
    project?.context?.architecture,
    project?.context?.repositoryAccess,
    project?.metadata?.title,
    project?.metadata?.tagline,
    project?.metadata?.platform,
    ...(Array.isArray(project?.tags) ? project.tags : []),
    ...techList,
  ]
    .map(normalizeText)
    .filter(Boolean)
    .join(" ");

  return haystack.includes(term);
};

const applyProjectFilters = (projects, filters = {}) => {
  const f = normalizeProjectFilters(filters);

  return projects.filter((project) => {
    if (f.status && f.status.toLowerCase() !== "all") {
      const s = normalizeText(project?.status);
      if (s !== normalizeText(f.status)) return false;
    }

    if (f.platform && f.platform.toLowerCase() !== "all") {
      const p = normalizeText(
        project?.context?.platform || project?.metadata?.platform,
      );
      if (!p.includes(normalizeText(f.platform))) return false;
    }

    if (f.architecture && f.architecture.toLowerCase() !== "all") {
      const a = normalizeText(project?.context?.architecture);
      if (!a.includes(normalizeText(f.architecture))) return false;
    }

    if (f.repositoryAccess && f.repositoryAccess.toLowerCase() !== "all") {
      const r = normalizeText(project?.context?.repositoryAccess);
      if (r !== normalizeText(f.repositoryAccess)) return false;
    }

    if (f.category && f.category.toLowerCase() !== "all") {
      if (normalizeText(project?.category) !== normalizeText(f.category))
        return false;
    }

    if (f.tag) {
      const tags = Array.isArray(project?.tags) ? project.tags : [];
      if (!tags.some((t) => normalizeText(t).includes(normalizeText(f.tag))))
        return false;
    }

    if (f.featured !== undefined) {
      const isFeatured = project?.isFeatured === true || project?.featured === true;
      if (isFeatured !== f.featured) return false;
    }

    return matchesSearch(project, f.q);
  });
};

const buildQueryParams = (filters = {}) => {
  const f = normalizeProjectFilters(filters);
  const params = {};

  if (f.q)            params.q = f.q;
  if (f.status        && f.status.toLowerCase()         !== "all") params.status         = f.status;
  if (f.platform      && f.platform.toLowerCase()       !== "all") params.platform       = f.platform;
  if (f.architecture  && f.architecture.toLowerCase()   !== "all") params.architecture   = f.architecture;
  if (f.repositoryAccess && f.repositoryAccess.toLowerCase() !== "all") params.repositoryAccess = f.repositoryAccess;
  if (f.category      && f.category.toLowerCase()       !== "all") params.category       = f.category;
  if (f.tag)          params.tag = f.tag;
  if (f.featured !== undefined) params.featured = String(f.featured);

  return params;
};

// ── Collection normalization ──────────────────────────────────────────────

const normalizeProjectCollection = (payload) =>
  dedupeProjects(
    resolveProjectEntries(payload).map(normalizeProjectPayload).filter(Boolean),
  );

// ── Fallback data ─────────────────────────────────────────────────────────

export const FALLBACK_PROJECTS = dedupeProjects([
  ...normalizeProjectCollection(projectExportsRaw),
  ...normalizeProjectCollection(developerProjectsRaw),
]);

// ── Project param matching ────────────────────────────────────────────────

const matchesProjectParam = (project, id) => {
  const needle = normalizeText(id);
  if (!needle) return false;

  return [project?.id, project?._id, project?.externalId, project?.slug].some(
    (candidate) => normalizeText(candidate) === needle,
  );
};

// ── Public API ────────────────────────────────────────────────────────────

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
    if (project) return project;
  } catch {
    // No-op: fall through to fallback
  }

  return FALLBACK_PROJECTS.find((item) => matchesProjectParam(item, id)) || null;
};

export default { fetchProjects, fetchProjectById };
