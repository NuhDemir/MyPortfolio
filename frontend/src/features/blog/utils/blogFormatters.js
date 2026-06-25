export const stripHtml = (value = "") =>
  String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export const buildExcerpt = (blog, maxLen = 160) => {
  if (!blog) return "";
  const base = blog.excerpt || blog.summary || stripHtml(blog.content || "");
  const normalized = base.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLen) return normalized;
  return `${normalized.slice(0, maxLen - 3).trimEnd()}...`;
};

export const buildSubtitle = (blog) => {
  if (!blog) return "";
  const base = blog.subtitle || blog.excerpt || blog.summary || stripHtml(blog.content || "");
  const normalized = base.replace(/\s+/g, " ").trim();
  const maxLen = 220;
  if (normalized.length <= maxLen) return normalized;
  return `${normalized.slice(0, maxLen - 3).trimEnd()}...`;
};

export const formatToLocaleDate = (value, includeTime = false) => {
  if (!value) return null;
  try {
    const options = { year: "numeric", month: "long", day: "numeric" };
    if (includeTime) { options.hour = "2-digit"; options.minute = "2-digit"; }
    return new Intl.DateTimeFormat("tr-TR", options).format(new Date(value));
  } catch {
    return null;
  }
};

export const resolvePublisherName = (publisher) => {
  if (!publisher) return null;
  if (typeof publisher === "string") return publisher;
  const profile = publisher.profile || {};
  return publisher.fullName || profile.fullName ||
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    publisher.username || null;
};

export const normalizeSlug = (blog) =>
  blog?.slug || (blog?.title ? String(blog.title).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : "");

export const resolveBlogThumbnail = (blog) =>
  blog?.thumbnail?.url || blog?.thumbnailUrl || blog?.thumbnail || blog?.coverImage || null;
