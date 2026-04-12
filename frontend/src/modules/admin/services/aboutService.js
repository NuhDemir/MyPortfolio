import axiosClient from "@core/http/axiosClient";

const resolveErrorMessage = (error, fallback) =>
  error?.response?.data?.message ?? error?.message ?? fallback;

export const getAboutAdminContent = async () => {
  try {
    const response = await axiosClient.get("/about/admin/content");
    return response.data;
  } catch (error) {
    throw new Error(
      resolveErrorMessage(error, "About icerigi getirilirken hata olustu."),
    );
  }
};

export const updateAboutAdminContent = async (payload) => {
  try {
    const response = await axiosClient.put("/about/admin/content", payload);
    return response.data;
  } catch (error) {
    throw new Error(
      resolveErrorMessage(error, "About icerigi guncellenirken hata olustu."),
    );
  }
};

export default {
  getAboutAdminContent,
  updateAboutAdminContent,
};
