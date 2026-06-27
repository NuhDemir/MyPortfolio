import { axiosClient } from "@core";

const REQUEST_TIMEOUT_MS = 2800;

const resolveThumbnail = (blog) => {
  if (!blog) {
    return null;
  }

  if (typeof blog.thumbnail === "string") {
    return { url: blog.thumbnail, alt: blog.title || "Blog gorseli" };
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
        "Blog gorseli",
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

const normalizeText = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim().toLowerCase();
};

const resolveBlogEntries = (payload) => {
  if (Array.isArray(payload)) {
    return payload.flatMap((entry) => {
      if (entry && Array.isArray(entry.items)) {
        return entry.items;
      }
      return entry && typeof entry === "object" ? [entry] : [];
    });
  }

  if (payload && typeof payload === "object" && Array.isArray(payload.items)) {
    return payload.items;
  }

  return [];
};

const normalizeBlogCollection = (payload) =>
  resolveBlogEntries(payload)
    .map(transformBlogPayload)
    .filter((item) => item && typeof item === "object");

const matchesSlugOrId = (blog, slug) => {
  const needle = normalizeText(slug);
  if (!needle) {
    return false;
  }

  return [blog?.slug, blog?.id, blog?._id].some(
    (candidate) => normalizeText(candidate) === needle,
  );
};

// Backend uykudayken kullanıcıyı bekletmemek için kısa timeout + lokal fallback.
// Opsiyonel signal desteği ile istek iptal edilebilir.
export const fetchBlogs = async (options = {}) => {
  const { signal } = options;

  try {
    const response = await axiosClient.get("/blog", {
      timeout: REQUEST_TIMEOUT_MS,
      signal,
    });
    const blogs = normalizeBlogCollection(response.data);
    return blogs;
  } catch {
    return [];
  }
};

export const fetchBlogBySlug = async (slug, options = {}) => {
  const { signal } = options;

  try {
    const response = await axiosClient.get(`/blog/${slug}`, {
      timeout: REQUEST_TIMEOUT_MS,
      signal,
    });
    const blog = transformBlogPayload(response.data);
    if (blog && typeof blog === "object") {
      return blog;
    }
  } catch {
    // No-op
  }

  return null;
};

export const likeBlog = async (id, options = {}) => {
  const { signal } = options;
  try {
    const response = await axiosClient.post(`/blog/${id}/like`, {}, {
      timeout: REQUEST_TIMEOUT_MS,
      signal,
    });
    return response.data;
  } catch {
    return null;
  }
};

export default {
  fetchBlogs,
  fetchBlogBySlug,
  likeBlog,
};
