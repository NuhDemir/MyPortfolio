import axiosClient from "@core/http/axiosClient";
import fallbackBlogs from "@shared/data/blogs.json";

// Geliştirme: backend yoksa sessiz fallback kullan. Prod ortamda gerçek hata atılmasını
// tercih ederseniz burayı prod flag ile koşullandırabilirsiniz.
export const fetchBlogs = async () => {
  try {
    const response = await axiosClient.get("/blog");
    const blogs = Array.isArray(response.data) ? response.data : [];
    return blogs.map(transformBlogPayload);
  } catch {
    // API yoksa local fallback kullan
    return Array.isArray(fallbackBlogs)
      ? fallbackBlogs.map(transformBlogPayload)
      : [];
  }
};

export const fetchBlogBySlug = async (slug) => {
  try {
    const response = await axiosClient.get(`/blog/${slug}`);
    return transformBlogPayload(response.data);
  } catch {
    // Önce local fallback içinde ara
    const found = Array.isArray(fallbackBlogs)
      ? fallbackBlogs.find((b) => b.slug === slug || b.id === slug)
      : null;
    return found ? transformBlogPayload(found) : null;
  }
};

export default {
  fetchBlogs,
  fetchBlogBySlug,
};

const transformBlogPayload = (blog) => {
  if (!blog || typeof blog !== "object") {
    return blog;
  }

  const normalizedThumbnail = resolveThumbnail(blog);
  const author = normalizeAuthor(blog.authorDetails || blog.author);
  const media = Array.isArray(blog.galleryImages)
    ? blog.galleryImages.map(normalizeGalleryItem)
    : [];

  return {
    ...blog,
    author,
    thumbnail: normalizedThumbnail,
    galleryImages: media,
    tags: Array.isArray(blog.tags) ? blog.tags : [],
    seo: blog.seo || null,
    analytics: blog.analytics || null,
    revisions: Array.isArray(blog.revisions) ? blog.revisions : [],
    tableOfContents: Array.isArray(blog.tableOfContents)
      ? blog.tableOfContents
      : [],
  };
};

const resolveThumbnail = (blog) => {
  if (!blog) {
    return null;
  }

  if (typeof blog.thumbnail === "string") {
    return { url: blog.thumbnail, alt: blog.title || "Blog görseli" };
  }

  if (blog.thumbnail && typeof blog.thumbnail === "object") {
    return {
      url:
        blog.thumbnail.url || blog.thumbnail.secure_url || blog.thumbnail.path,
      alt:
        blog.thumbnail.alt ||
        blog.thumbnail.caption ||
        blog.thumbnail.title ||
        blog.title ||
        "Blog görseli",
    };
  }

  return null;
};

const normalizeAuthor = (author) => {
  if (!author) {
    return null;
  }

  if (typeof author === "string") {
    return { id: author };
  }

  return {
    id: author._id || author.id || author.username,
    username: author.username,
    email: author.email,
    role: author.role,
    avatar: author.profile?.avatar || null,
    fullName:
      author.profile?.fullName ||
      [author.profile?.firstName, author.profile?.lastName]
        .filter(Boolean)
        .join(" ") ||
      author.username,
    themePreference: author.preferences?.theme,
  };
};

const normalizeGalleryItem = (item) => {
  if (!item) {
    return null;
  }

  return {
    url: item.url,
    alt: item.alt || item.caption || "",
    caption: item.caption || null,
    order: typeof item.order === "number" ? item.order : 0,
  };
};
