import axiosClient from "@core/http/axiosClient";
import projectExportsRaw from "@modules/projects/data/projectData.json";
import developerProjectsRaw from "@shared/data/developerProjects.json";

const REQUEST_TIMEOUT_MS = 2800;

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
  const { signal } = options;

  try {
    const response = await axiosClient.get("/projects", {
      timeout: REQUEST_TIMEOUT_MS,
      signal,
    });
    const projects = normalizeProjectCollection(response.data);
    return projects.length > 0 ? projects : FALLBACK_PROJECTS;
  } catch {
    return FALLBACK_PROJECTS;
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
