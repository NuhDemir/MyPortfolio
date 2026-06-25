import { axiosClient } from "@core";
import projectsData from "../data/projects.json";
import { REQUEST_TIMEOUT_MS } from "../constants";

export const FALLBACK_PROJECTS = projectsData;

const dedupe = (list) => {
  const map = new Map();
  for (const p of list) {
    const key = p.id || p.slug || p.title;
    if (key && !map.has(key)) map.set(key, p);
  }
  return Array.from(map.values());
};

export const fetchProjects = async (options = {}) => {
  const { signal, filters = {}, includeSource = false } = options;

  try {
    const response = await axiosClient.get("/projects", {
      timeout: REQUEST_TIMEOUT_MS,
      signal,
      params: filters,
    });
    const items = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data?.items)
        ? response.data.items
        : response.data
          ? [response.data]
          : [];
    const normalized = dedupe(items).length > 0 ? dedupe(items) : FALLBACK_PROJECTS;
    return includeSource
      ? { items: normalized, source: items.length > 0 ? "live" : "fallback" }
      : normalized;
  } catch {
    return includeSource
      ? { items: FALLBACK_PROJECTS, source: "fallback" }
      : FALLBACK_PROJECTS;
  }
};

export const fetchProjectById = async (id, options = {}) => {
  const { signal } = options;
  try {
    const response = await axiosClient.get(`/projects/${id}`, {
      timeout: REQUEST_TIMEOUT_MS,
      signal,
    });
    if (response.data) return response.data;
  } catch { /* fall through */ }
  return FALLBACK_PROJECTS.find((p) => p.id === id || p.slug === id) || null;
};
