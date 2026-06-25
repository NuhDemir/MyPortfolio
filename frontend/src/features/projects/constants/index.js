export const POLL_INTERVAL_MS = 5 * 60 * 1000;
export const REQUEST_TIMEOUT_MS = 2800;
export const PROJECTS_PAGE_SIZE = 6;
export const TAG_CLOUD_MAX = 30;
export const VIEW_COUNT_STORAGE_KEY = "portfolio_project_views";
export const LIKES_STORAGE_KEY = "portfolio_project_likes";

export const SORT_OPTIONS = {
  featured: { label: "One Cikanlar", field: "isFeatured" },
  newest: { label: "En Yeni", field: "createdAt" },
  oldest: { label: "En Eski", field: "createdAt" },
  az: { label: "A-Z", field: "title" },
};

export const STATUS_OPTIONS = ["all", "active", "completed", "archived", "in-progress"];

export const DIFFICULTY_OPTIONS = ["all", "beginner", "intermediate", "advanced"];

export const PLATFORM_FILTER_KEYS = ["web", "mobile", "desktop", "api", "fullstack"];
