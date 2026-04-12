const escapeRegExp = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const exactRegex    = (v) => new RegExp(`^${escapeRegExp(v)}$`, "i");
const containsRegex = (v) => new RegExp(escapeRegExp(v), "i");

const pushIfTruthy = (list, clause) => {
  if (clause && typeof clause === "object") list.push(clause);
};

const buildFeaturedClause = (featured) => {
  if (featured === undefined) return null;

  if (featured === true) {
    return { isFeatured: true };
  }

  return {
    $or: [{ isFeatured: false }, { isFeatured: { $exists: false } }],
  };
};

const buildSearchClause = (queryText) => {
  if (!queryText) return null;

  const regex = containsRegex(queryText);

  return {
    $or: [
      { title: regex },
      { slug: regex },
      { tagline: regex },
      { description: regex },
      { excerpt: regex },
      { category: regex },
      { tags: { $in: [regex] } },
      { "technologies.name": regex },
      { "context.platform": regex },
      { "context.role": regex },
      { "context.architecture": regex },
      // legacy shim fields
      { "metadata.title": regex },
      { "metadata.tagline": regex },
      { "metadata.platform": regex },
    ],
  };
};

export const buildProjectListQuery = (filters = {}) => {
  const clauses = [];

  if (filters.status) {
    pushIfTruthy(clauses, { status: exactRegex(filters.status) });
  }

  if (filters.platform) {
    const regex = containsRegex(filters.platform);
    pushIfTruthy(clauses, {
      $or: [
        { "context.platform": regex },
        { "metadata.platform": regex },
      ],
    });
  }

  if (filters.architecture) {
    pushIfTruthy(clauses, {
      "context.architecture": exactRegex(filters.architecture),
    });
  }

  if (filters.repositoryAccess) {
    pushIfTruthy(clauses, {
      "context.repositoryAccess": exactRegex(filters.repositoryAccess),
    });
  }

  if (filters.category) {
    pushIfTruthy(clauses, { category: exactRegex(filters.category) });
  }

  if (filters.tag) {
    pushIfTruthy(clauses, {
      tags: { $in: [containsRegex(filters.tag)] },
    });
  }

  pushIfTruthy(clauses, buildFeaturedClause(filters.featured));
  pushIfTruthy(clauses, buildSearchClause(filters.q));

  if (clauses.length === 0) return {};
  if (clauses.length === 1) return clauses[0];
  return { $and: clauses };
};

export default buildProjectListQuery;
