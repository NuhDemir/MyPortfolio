import { axiosClient } from "@core";
import fallbackData from "../data/resourcesFallback.json";

const REQUEST_TIMEOUT_MS = 2800;

export const FALLBACK_RESOURCES = fallbackData;

const normalizeResource = (r) => ({
  ...r,
  id: r._id || r.id,
  rating: Number(r.rating) || 0,
  tags: Array.isArray(r.tags) ? r.tags : [],
});

const normalizeCollection = (payload) => {
  const items = Array.isArray(payload) ? payload : [];
  return items.map(normalizeResource);
};

const buildQueryParams = (filters = {}) => {
  const params = {};
  if (filters.type) params.type = filters.type;
  if (filters.tag) params.tag = filters.tag;
  if (filters.language) params.language = filters.language;
  if (filters.difficulty) params.difficulty = filters.difficulty;
  if (filters.featured !== undefined) params.featured = String(filters.featured);
  return params;
};

export const fetchResources = async (options = {}) => {
  const { signal, filters = {} } = options;

  try {
    const response = await axiosClient.get("/resources", {
      timeout: REQUEST_TIMEOUT_MS,
      signal,
      params: buildQueryParams(filters),
    });
    const resources = normalizeCollection(response.data);
    return resources.length > 0 ? resources : FALLBACK_RESOURCES;
  } catch {
    return FALLBACK_RESOURCES;
  }
};

export const fetchResourceBySlug = async (slug, options = {}) => {
  const { signal } = options;

  try {
    const response = await axiosClient.get(`/resources/${slug}`, {
      timeout: REQUEST_TIMEOUT_MS,
      signal,
    });
    return normalizeResource(response.data);
  } catch {
    return FALLBACK_RESOURCES.find((r) => r.slug === slug) || null;
  }
};
