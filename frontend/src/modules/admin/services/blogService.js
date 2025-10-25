import axiosClient from "../../../core/http/axiosClient";

export const getBlogs = async () => {
  try {
    const response = await axiosClient.get("/blog");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Blog yazıları getirilirken hata oluştu."
    );
  }
};

export const getBlogBySlug = async (slug) => {
  try {
    const response = await axiosClient.get(`/blog/${slug}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Blog yazısı detayları getirilirken hata oluştu."
    );
  }
};

export const createBlog = async (blogData) => {
  try {
    const formData = new FormData();

    Object.entries(blogData).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      if (key === "tags" && Array.isArray(value)) {
        formData.append(key, value.join(","));
      } else if (key === "isPublished") {
        formData.append(key, String(value));
      } else {
        formData.append(key, value);
      }
    });

    const response = await axiosClient.post("/blog", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Blog yazısı oluşturulurken hata oluştu."
    );
  }
};

export const updateBlog = async (id, updateData) => {
  try {
    const formData = new FormData();

    Object.entries(updateData).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      if (key === "tags" && Array.isArray(value)) {
        formData.append(key, value.join(","));
      } else if (key === "isPublished") {
        formData.append(key, String(value));
      } else {
        formData.append(key, value);
      }
    });

    const response = await axiosClient.put(`/blog/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Blog yazısı güncellenirken hata oluştu."
    );
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await axiosClient.delete(`/blog/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Blog yazısı silinirken hata oluştu."
    );
  }
};
