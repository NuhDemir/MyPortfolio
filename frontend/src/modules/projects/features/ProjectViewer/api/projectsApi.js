import {
  FALLBACK_PROJECTS,
  fetchProjects,
} from "@modules/projects/services/projectService.js";

const normalizeFilters = (filters = {}) => ({
  q: filters.searchQuery || "",
  status: filters.statusFilter || "all",
  platform: filters.platformFilter || "all",
  featured: filters.featuredOnly ? true : undefined,
});

const toSafeList = (items) =>
  Array.isArray(items) && items.length > 0 ? items : FALLBACK_PROJECTS;

export const getProjects = async (filters = {}, signal) => {
  const response = await fetchProjects({
    signal,
    filters: normalizeFilters(filters),
    includeSource: true,
  });

  return toSafeList(response?.items);
};

export const getProjectByIndex = async (index, signal) => {
  const items = await getProjects({}, signal);

  if (!items.length) {
    return null;
  }

  const targetIndex = Math.min(Math.max(Number(index) || 0, 0), items.length - 1);
  return items[targetIndex] || null;
};
