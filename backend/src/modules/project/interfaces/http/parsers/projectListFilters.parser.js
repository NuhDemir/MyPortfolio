const normalizeText = (value) => {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
};

const parseBoolean = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const normalized = normalizeText(value).toLowerCase();
  if (["true", "1", "yes", "on"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no", "off"].includes(normalized)) {
    return false;
  }

  return undefined;
};

export const parseProjectListFilters = (query = {}) => {
  const status = normalizeText(query.status).toLowerCase();
  const platform = normalizeText(query.platform);
  const search = normalizeText(query.q || query.search);
  const tag = normalizeText(query.tag);

  return {
    status: status && status !== "all" ? status : undefined,
    platform: platform && platform.toLowerCase() !== "all" ? platform : undefined,
    featured: parseBoolean(query.featured),
    q: search,
    tag,
  };
};

export default parseProjectListFilters;