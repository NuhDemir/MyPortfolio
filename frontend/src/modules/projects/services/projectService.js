import axiosClient from "@core/http/axiosClient";
import fallbackProjects from "@modules/projects/data/projectData.json";

const REQUEST_TIMEOUT_MS = 2800;

export const fetchProjects = async (options = {}) => {
  const { signal } = options;

  try {
    const response = await axiosClient.get("/projects", {
      timeout: REQUEST_TIMEOUT_MS,
      signal,
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch {
    return Array.isArray(fallbackProjects) ? fallbackProjects : [];
  }
};

export const fetchProjectById = async (id, options = {}) => {
  const { signal } = options;

  try {
    const response = await axiosClient.get(`/projects/${id}`, {
      timeout: REQUEST_TIMEOUT_MS,
      signal,
    });
    return response.data;
  } catch {
    const found = Array.isArray(fallbackProjects)
      ? fallbackProjects.find((item) => item.id === id || item.slug === id)
      : null;
    return found || null;
  }
};

export default {
  fetchProjects,
  fetchProjectById,
};
