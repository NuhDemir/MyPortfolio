import axiosClient from "@core/http/axiosClient";

const resolveErrorMessage = (error, fallback) =>
  error?.response?.data?.message ?? error?.message ?? fallback;

export const fetchBlogs = async () => {
  try {
    const response = await axiosClient.get("/blog");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    throw new Error(resolveErrorMessage(error, "Blog yazıları yüklenemedi."));
  }
};

export const fetchBlogBySlug = async (slug) => {
  try {
    const response = await axiosClient.get(`/blog/${slug}`);
    return response.data;
  } catch (error) {
    throw new Error(
      resolveErrorMessage(
        error,
        "Blog yazısı detayları yüklenirken hata oluştu."
      )
    );
  }
};

export default {
  fetchBlogs,
  fetchBlogBySlug,
};
