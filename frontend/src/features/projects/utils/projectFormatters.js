const normalizeText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim().toLowerCase();
};

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const getProjectTitle = (p) =>
  p?.title || p?.metadata?.title || "";

export const getProjectTagline = (p) =>
  p?.tagline || p?.metadata?.tagline || p?.description || p?.excerpt || "";

export const getProjectStatus = (p) =>
  p?.status || p?.metadata?.status || "";

export const getProjectPlatform = (p) =>
  p?.context?.platform || p?.metadata?.platform || p?.platform || "";

export const getProjectRole = (p) =>
  p?.context?.role || p?.metadata?.role || p?.role || "";

export const getProjectTeam = (p) => {
  const size = p?.context?.teamSize ?? p?.teamSize;
  return size != null ? String(size) : (p?.metadata?.team || p?.team || "");
};

export const getProjectDuration = (p) =>
  p?.context?.duration || p?.duration || "";

export const getProjectArchitecture = (p) =>
  p?.context?.architecture || "";

export const getProjectRepositoryAccess = (p) =>
  p?.context?.repositoryAccess || "";

export const getProjectDifficulty = (p) =>
  p?.context?.difficulty || p?.difficulty || "";

export const getProjectCreatedAt = (p) =>
  p?.context?.startDate || p?.startDate || p?.metadata?.createdAt || p?.createdAt || "";

export const getProjectLinks = (p) => ({
  liveDemo: p?.links?.liveDemo ?? p?.liveUrl ?? "",
  github: p?.links?.github ?? p?.githubUrl ?? "",
  figma: p?.links?.figma ?? p?.figmaUrl ?? "",
  documentation: p?.links?.documentation ?? "",
});

export const getProjectHeroMedia = (p) => ({
  heroVideoUrl: p?.visuals?.heroVideoUrl || "",
  heroImageUrl: p?.visuals?.heroImageUrl || "",
  thumbnailUrl: p?.visuals?.thumbnailUrl || p?.imageUrl || "",
});

export const isProjectFeatured = (p) =>
  p?.isFeatured === true || p?.featured === true || String(p?.isFeatured) === "true" || String(p?.featured) === "true";

export const hasCaseStudy = (p) => {
  const cs = p?.caseStudy;
  if (!cs || typeof cs !== "object") return false;
  return Boolean(
    cs?.problem?.description ||
    cs?.solution?.description ||
    (Array.isArray(cs?.challenges) && cs.challenges.length > 0) ||
    (Array.isArray(cs?.metrics) && cs.metrics.length > 0) ||
    cs?.highlightCode?.codeSnippet,
  );
};

export const getPrimaryTechStack = (p) => {
  const tokens = [];
  if (Array.isArray(p?.technologies) && p.technologies.length > 0) {
    for (const item of p.technologies) {
      if (typeof item === "string") tokens.push(item);
      else if (item?.name) tokens.push(item.name);
    }
  }
  if (tokens.length === 0 && Array.isArray(p?.techStack)) {
    for (const group of p.techStack) {
      if (Array.isArray(group?.items)) tokens.push(...group.items);
    }
  }
  if (tokens.length === 0 && Array.isArray(p?.tags)) {
    tokens.push(...p.tags);
  }
  return tokens.map((t) => String(t).trim()).filter(Boolean).slice(0, 15);
};

export const collectAllTags = (projects) => {
  const tagMap = new Map();
  for (const p of projects) {
    const techs = getPrimaryTechStack(p);
    const tags = Array.isArray(p?.tags) ? p.tags : [];
    for (const t of [...techs, ...tags]) {
      const clean = normalizeText(t);
      if (!clean) continue;
      tagMap.set(clean, (tagMap.get(clean) || 0) + 1);
    }
  }
  return Array.from(tagMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
};

export const matchesProjectParam = (project, slugOrId) => {
  let raw = slugOrId;
  try { raw = decodeURIComponent(String(slugOrId)); } catch { raw = slugOrId; }
  const param = normalizeText(raw);
  if (!param) return false;
  const candidates = [
    project?.slug,
    project?.id,
    project?._id,
    project?.externalId,
  ].map(normalizeText);
  if (candidates.some((c) => c && c === param)) return true;
  const titleSlug = slugify(getProjectTitle(project));
  return titleSlug && titleSlug === param;
};

export const getProjectRouteParam = (p) =>
  p?.slug || p?.id || p?._id || p?.externalId || p?.title;

export const collectFilterOptions = (projects) => {
  const statuses = new Set();
  const platforms = new Set();
  const difficulties = new Set();
  for (const p of projects) {
    const status = normalizeText(getProjectStatus(p));
    const platform = normalizeText(getProjectPlatform(p));
    const difficulty = normalizeText(getProjectDifficulty(p));
    if (status) statuses.add(status);
    if (platform) platforms.add(platform);
    if (difficulty) difficulties.add(difficulty);
  }
  return {
    statuses: Array.from(statuses).sort(),
    platforms: Array.from(platforms).sort(),
    difficulties: Array.from(difficulties).sort(),
  };
};

export const sortProjects = (list, sortKey = "featured") => {
  const sorted = [...list];
  sorted.sort((a, b) => {
    const af = isProjectFeatured(a) ? 1 : 0;
    const bf = isProjectFeatured(b) ? 1 : 0;
    if (af !== bf) return bf - af;
    if (sortKey === "newest" || sortKey === "featured") {
      const ad = getProjectCreatedAt(a);
      const bd = getProjectCreatedAt(b);
      if (ad && bd) return new Date(bd).getTime() - new Date(ad).getTime();
    }
    if (sortKey === "oldest") {
      const ad = getProjectCreatedAt(a);
      const bd = getProjectCreatedAt(b);
      if (ad && bd) return new Date(ad).getTime() - new Date(bd).getTime();
    }
    if (sortKey === "az") {
      return getProjectTitle(a).localeCompare(getProjectTitle(b));
    }
    return 0;
  });
  return sorted;
};

export const filterProjects = (projects, filters) => {
  const { query, status, platform, difficulty, featuredOnly, caseStudyOnly, selectedTags } = filters;
  const q = normalizeText(query);
  return projects.filter((p) => {
    if (featuredOnly && !isProjectFeatured(p)) return false;
    if (caseStudyOnly && !hasCaseStudy(p)) return false;
    if (status && status !== "all" && normalizeText(getProjectStatus(p)) !== status) return false;
    if (platform && platform !== "all") {
      const pp = normalizeText(getProjectPlatform(p));
      if (!pp.includes(platform)) return false;
    }
    if (difficulty && difficulty !== "all" && normalizeText(getProjectDifficulty(p)) !== difficulty) return false;
    if (selectedTags && selectedTags.length > 0) {
      const techs = getPrimaryTechStack(p).map(normalizeText);
      const tags = (Array.isArray(p?.tags) ? p.tags : []).map(normalizeText);
      const all = new Set([...techs, ...tags]);
      if (!selectedTags.some((t) => all.has(normalizeText(t)))) return false;
    }
    if (!q) return true;
    const title = normalizeText(getProjectTitle(p));
    const tagline = normalizeText(getProjectTagline(p));
    const platformText = normalizeText(getProjectPlatform(p));
    const role = normalizeText(getProjectRole(p));
    const techTokens = getPrimaryTechStack(p).map(normalizeText);
    const haystack = [title, tagline, platformText, role, ...techTokens].filter(Boolean).join(" ");
    return haystack.includes(q);
  });
};
