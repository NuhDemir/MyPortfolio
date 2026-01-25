import axiosClient from "@core/http/axiosClient";

const handleError = (error, context) => {
  console.error(`Proje ${context} hata detayı:`, error.response || error);
  const message =
    error.response?.data?.message ||
    `Proje ${context} bir sunucu hatası oluştu. Lütfen tekrar deneyin.`;
  throw new Error(message);
};

export const getProjects = async () => {
  try {
    const response = await axiosClient.get("/projects");
    return response.data;
  } catch (error) {
    handleError(error, "getirilirken");
  }
};

export const createProject = async (formData) => {
  try {
    const isFormData =
      typeof FormData !== "undefined" && formData instanceof FormData;

    const response = isFormData
      ? await axiosClient.post("/projects", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      : await axiosClient.post("/projects", formData);
    return response.data;
  } catch (error) {
    handleError(error, "oluşturulurken");
  }
};

export const updateProject = async (id, formData) => {
  try {
    const isFormData =
      typeof FormData !== "undefined" && formData instanceof FormData;

    const response = isFormData
      ? await axiosClient.put(`/projects/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      : await axiosClient.put(`/projects/${id}`, formData);
    return response.data;
  } catch (error) {
    handleError(error, "güncellenirken");
  }
};

export const deleteProject = async (id) => {
  try {
    const response = await axiosClient.delete(`/projects/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "silinirken");
  }
};

export const exportProjectsJson = async () => {
  try {
    return await axiosClient.get("/projects/export/json", {
      responseType: "blob",
    });
  } catch (error) {
    handleError(error, "JSON dışa aktarılırken");
  }
};
