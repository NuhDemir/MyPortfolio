import { axiosClient } from "@core";

const resolveErrorMessage = (error, fallback) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return fallback;
};

export const getResources = async () => {
  try {
    const response = await axiosClient.get("/resources");
    return response.data;
  } catch (error) {
    throw new Error(resolveErrorMessage(error, "Kaynaklar getirilirken hata olustu."));
  }
};

export const getResourceBySlug = async (slug) => {
  try {
    const response = await axiosClient.get(`/resources/${slug}`);
    return response.data;
  } catch (error) {
    throw new Error(resolveErrorMessage(error, "Kaynak getirilirken hata olustu."));
  }
};

export const createResource = async (resourceData) => {
  try {
    const isFormData = resourceData instanceof FormData;
    const response = isFormData
      ? await axiosClient.post("/resources", resourceData)
      : await axiosClient.post("/resources", resourceData);
    return response.data;
  } catch (error) {
    throw new Error(resolveErrorMessage(error, "Kaynak olusturulurken hata olustu."));
  }
};

export const updateResource = async (id, resourceData) => {
  try {
    const isFormData = resourceData instanceof FormData;
    const response = isFormData
      ? await axiosClient.put(`/resources/${id}`, resourceData)
      : await axiosClient.put(`/resources/${id}`, resourceData);
    return response.data;
  } catch (error) {
    throw new Error(resolveErrorMessage(error, "Kaynak guncellenirken hata olustu."));
  }
};

export const deleteResource = async (id) => {
  try {
    const response = await axiosClient.delete(`/resources/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(resolveErrorMessage(error, "Kaynak silinirken hata olustu."));
  }
};
