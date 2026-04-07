const escapeRegExp = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createCaseInsensitiveExactRegex = (value) =>
  new RegExp(`^${escapeRegExp(value)}$`, "i");

const createCaseInsensitiveContainsRegex = (value) =>
  new RegExp(escapeRegExp(value), "i");

const pushIfTruthy = (list, clause) => {
  if (clause && typeof clause === "object") {
    list.push(clause);
  }
};

const buildFeaturedClause = (featured) => {
  if (featured === undefined) {
    return null;
  }

  if (featured === true) {
    return {
      $or: [{ featured: true }, { isFeatured: true }],
    };
  }

  return {
    $and: [
      {
        $or: [{ featured: false }, { featured: { $exists: false } }],
      },
      {
        $or: [{ isFeatured: false }, { isFeatured: { $exists: false } }],
      },
    ],
  };
};

const buildSearchClause = (queryText) => {
  if (!queryText) {
    return null;
  }

  const regex = createCaseInsensitiveContainsRegex(queryText);

  return {
    $or: [
      { title: regex },
      { slug: regex },
      { description: regex },
      { excerpt: regex },
      { category: regex },
      { tags: { $in: [regex] } },
      { "metadata.title": regex },
      { "metadata.tagline": regex },
      { "metadata.platform": regex },
      { "metadata.status": regex },
    ],
  };
};

export const buildProjectListQuery = (filters = {}) => {
  const clauses = [];

  if (filters.status) {
    const regex = createCaseInsensitiveExactRegex(filters.status);
    pushIfTruthy(clauses, {
      $or: [{ status: regex }, { "metadata.status": regex }],
    });
  }

  if (filters.platform) {
    const regex = createCaseInsensitiveContainsRegex(filters.platform);
    pushIfTruthy(clauses, {
      $or: [{ platform: regex }, { "metadata.platform": regex }],
    });
  }

  if (filters.tag) {
    const regex = createCaseInsensitiveContainsRegex(filters.tag);
    pushIfTruthy(clauses, {
      tags: { $in: [regex] },
    });
  }

  pushIfTruthy(clauses, buildFeaturedClause(filters.featured));
  pushIfTruthy(clauses, buildSearchClause(filters.q));

  if (clauses.length === 0) {
    return {};
  }

  if (clauses.length === 1) {
    return clauses[0];
  }

  return { $and: clauses };
};

export default buildProjectListQuery;