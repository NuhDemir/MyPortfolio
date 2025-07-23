// frontend/src/services/blogService.js
import axiosInstance from "../api/axiosInstance";

// Tüm blog yazılarını getir (admin değilse sadece yayınlanmışlar)
const getBlogs = async () => {
  try {
    const response = await axiosInstance.get("/blog");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Blog yazıları getirilirken hata oluştu."
    );
  }
};

// Slug'a göre tek bir blog yazısını getir (admin değilse sadece yayınlanmış olan)
const getBlogBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`/blog/${slug}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Blog yazısı detayları getirilirken hata oluştu."
    );
  }
};

// Yeni blog yazısı oluştur
// blogData: { title, content, tags, category, isPublished, thumbnail? }
const createBlog = async (blogData) => {
  try {
    const formData = new FormData();
    for (const key in blogData) {
      if (blogData[key] !== undefined && blogData[key] !== null) {
        if (key === "tags" && Array.isArray(blogData[key])) {
          formData.append(key, blogData[key].join(","));
        } else if (key === "isPublished") {
          // Boolean değerleri string olarak gönder
          formData.append(key, String(blogData[key]));
        } else {
          formData.append(key, blogData[key]);
        }
      }
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axiosInstance.post("/blog", formData, config);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Blog yazısı oluşturulurken hata oluştu."
    );
  }
};

// Blog yazısını güncelle
// id: blog yazısının ID'si
// updateData: { title?, content?, tags?, category?, isPublished?, thumbnail? }
const updateBlog = async (id, updateData) => {
  try {
    const formData = new FormData();
    for (const key in updateData) {
      if (updateData[key] !== undefined && updateData[key] !== null) {
        if (key === "tags" && Array.isArray(updateData[key])) {
          formData.append(key, updateData[key].join(","));
        } else if (key === "isPublished") {
          formData.append(key, String(updateData[key]));
        } else {
          formData.append(key, updateData[key]);
        }
      }
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axiosInstance.put(`/blog/${id}`, formData, config);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Blog yazısı güncellenirken hata oluştu."
    );
  }
};

// Blog yazısını sil
const deleteBlog = async (id) => {
  try {
    const response = await axiosInstance.delete(`/blog/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Blog yazısı silinirken hata oluştu."
    );
  }
};

export { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog };
