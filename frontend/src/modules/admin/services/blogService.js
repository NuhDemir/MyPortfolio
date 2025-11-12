import axiosClient from "@core/http/axiosClient";

const resolveErrorMessage = (error, fallback) =>
  error?.response?.data?.message ?? error?.message ?? fallback;

export const getBlogs = async () => {
  try {
    const response = await axiosClient.get("/blog");
    return response.data;
  } catch (error) {
    throw new Error(
      resolveErrorMessage(error, "Blog yazıları getirilirken hata oluştu.")
    );
  }
};

export const getBlogBySlug = async (slug) => {
  try {
    const response = await axiosClient.get(`/blog/${slug}`);
    return response.data;
  } catch (error) {
    throw new Error(
      resolveErrorMessage(
        error,
        "Blog yazısı detayları getirilirken hata oluştu."
      )
    );
  }
};

export const createBlog = async (blogData) => {
  try {
    // If thumbnailUrl is provided (JSON upload), send as JSON
    if (blogData.thumbnailUrl && !blogData.thumbnail) {
      const response = await axiosClient.post("/blog", blogData);
      return response.data;
    }

    // Otherwise use FormData for file upload
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
    throw new Error(
      resolveErrorMessage(error, "Blog yazısı oluşturulurken hata oluştu.")
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
    throw new Error(
      resolveErrorMessage(error, "Blog yazısı güncellenirken hata oluştu.")
    );
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await axiosClient.delete(`/blog/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      resolveErrorMessage(error, "Blog yazısı silinirken hata oluştu.")
    );
  }
};
