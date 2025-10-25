import axiosClient from "@core/http/axiosClient";

export const fetchProjects = async () => {
  try {
    const response = await axiosClient.get("/projects");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Projeler yüklenirken bir hata oluştu.";
    throw new Error(message);
  }
};

export const fetchProjectById = async (id) => {
  try {
    const response = await axiosClient.get(`/projects/${id}`);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Proje detayları yüklenirken bir hata oluştu.";
    throw new Error(message);
  }
};

export default {
  fetchProjects,
  fetchProjectById,
};
