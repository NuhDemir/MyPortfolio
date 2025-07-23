import axiosInstance from "../api/axiosInstance";

const handleError = (error, context) => {
  console.error(`Proje ${context} hata detayı:`, error.response || error);
  const message =
    error.response?.data?.message ||
    `Proje ${context} bir sunucu hatası oluştu. Lütfen tekrar deneyin.`;
  throw new Error(message);
};

const getProjects = async () => {
  try {
    const response = await axiosInstance.get("/projects");
    return response.data;
  } catch (error) {
    handleError(error, "getirilirken");
  }
};

const createProject = async (formData) => {
  try {
    // Manuel header ayarı kaldırıldı. Axios FormData'yı tanıyacak ve doğru başlığı kendi ekleyecek.
    const response = await axiosInstance.post("/projects", formData);
    return response.data;
  } catch (error) {
    handleError(error, "oluşturulurken");
  }
};

const updateProject = async (id, formData) => {
  try {
    const response = await axiosInstance.put(`/projects/${id}`, formData);
    return response.data;
  } catch (error) {
    handleError(error, "güncellenirken");
  }
};

const deleteProject = async (id) => {
  try {
    const response = await axiosInstance.delete(`/projects/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "silinirken");
  }
};

export { getProjects, createProject, updateProject, deleteProject };
