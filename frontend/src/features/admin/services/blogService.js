import { axiosClient } from "@core";

const resolveErrorMessage = (error, fallback) =>
  error?.response?.data?.message ?? error?.message ?? fallback;

export const getBlogs = async () => {
  try {
    const response = await axiosClient.get("/blog");
    return response.data;
  } catch (error) {
    throw new Error(
      resolveErrorMessage(error, "Blog yazıları getirilirken hata oluştu."),
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
        "Blog yazısı detayları getirilirken hata oluştu.",
      ),
    );
  }
};

export const createBlog = async (blogData) => {
  try {
    const hasThumbnailUrl = blogData.thumbnailUrl && !blogData.thumbnail;

    if (hasThumbnailUrl) {
      const response = await axiosClient.post("/blog", blogData);
      return response.data;
    }

    const formData = new FormData();

    Object.entries(blogData).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (key === "tags" && Array.isArray(value)) {
        formData.append(key, value.join(","));
      } else if (key === "isPublished") {
        formData.append(key, String(value));
      } else {
        formData.append(key, value);
      }
    });

    const response = await axiosClient.post("/blog", formData);
    return response.data;
  } catch (error) {
    throw new Error(
      resolveErrorMessage(error, "Blog yazisi olusturulurken hata olustu."),
    );
  }
};

export const updateBlog = async (id, updateData) => {
  try {
    const hasFile = updateData.thumbnail instanceof File || updateData.thumbnail instanceof Blob;

    if (!hasFile) {
      // No file upload — send as JSON so booleans/numbers are preserved correctly
      const body = { ...updateData };
      // Convert tags array to comma-separated string for consistency with backend parser
      if (Array.isArray(body.tags)) {
        body.tags = body.tags.join(",");
      }
      const response = await axiosClient.put(`/blog/${id}`, body);
      return response.data;
    }

    // File upload path — use FormData
    const formData = new FormData();
    Object.entries(updateData).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
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
      resolveErrorMessage(error, "Blog yazısı güncellenirken hata oluştu."),
    );
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await axiosClient.delete(`/blog/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      resolveErrorMessage(error, "Blog yazısı silinirken hata oluştu."),
    );
  }
};

export const exportBlogsJson = async () => {
  try {
    return await axiosClient.get("/blog/export/json", {
      responseType: "blob",
    });
  } catch (error) {
    throw new Error(
      resolveErrorMessage(error, "Blog JSON dışa aktarılırken hata oluştu."),
    );
  }
};
