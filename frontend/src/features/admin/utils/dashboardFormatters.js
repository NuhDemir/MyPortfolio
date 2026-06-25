const RELATIVE_TIME_FORMATTER = new Intl.RelativeTimeFormat("tr-TR", {
  numeric: "auto",
});

const DIVISIONS = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

export const formatRelativeTime = (isoString) => {
  if (!isoString) return "";
  const target = new Date(isoString);
  if (Number.isNaN(target.getTime())) return "";

  let duration = (target.getTime() - Date.now()) / 1000;
  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return RELATIVE_TIME_FORMATTER.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return target.toLocaleDateString("tr-TR", { dateStyle: "medium" });
};

export const formatDate = (isoString) => {
  if (!isoString) return "-";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("tr-TR", { dateStyle: "medium", timeStyle: "short" });
};

export const formatDay = () => {
  return new Date().toLocaleDateString("tr-TR", { dateStyle: "long" });
};

const ACTIVITY_HEADLINES = {
  project: { updated: "Proje guncellendi", default: "Yeni proje yayimlandi" },
  blog: { updated: "Blog yazisi guncellendi", default: "Yeni blog yazisi yayinlandi" },
  message: { updated: "Mesaj guncellendi", default: "Yeni mesaj alindi" },
};

export const getActivityHeadline = (item) => {
  if (!item) return "Yeni aktivite";
  if (item.headline) return item.headline;
  const typeMap = ACTIVITY_HEADLINES[item.type];
  if (!typeMap) return "Yeni aktivite";
  return item.action === "updated" ? typeMap.updated : typeMap.default;
};

const ACTIVITY_ROUTES = {
  project: "/admin/projects",
  blog: "/admin/blog",
};

export const getActivityRoute = (item) => {
  if (!item) return null;
  return ACTIVITY_ROUTES[item.type] || null;
};

const ACTIVITY_ICONS = {
  project: "Workspaces",
  blog: "Article",
  message: "Message",
};

export const getActivityIconKey = (type) => {
  return ACTIVITY_ICONS[type] || "Timeline";
};
