const STORAGE_PREFIX = "portfolio_project_";

export const getViewCount = (projectId) => {
  try {
    const data = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}views`) || "{}");
    return data[projectId] || 0;
  } catch {
    return 0;
  }
};

export const incrementViewCount = (projectId) => {
  try {
    const data = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}views`) || "{}");
    data[projectId] = (data[projectId] || 0) + 1;
    localStorage.setItem(`${STORAGE_PREFIX}views`, JSON.stringify(data));
    return data[projectId];
  } catch {
    return 0;
  }
};

export const getLikeCount = (projectId) => {
  try {
    const data = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}likes`) || "{}");
    return data[projectId] || 0;
  } catch {
    return 0;
  }
};

export const toggleLike = (projectId) => {
  try {
    const data = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}likes`) || "{}");
    const liked = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}liked_set`) || "{}");
    if (liked[projectId]) {
      data[projectId] = Math.max(0, (data[projectId] || 1) - 1);
      liked[projectId] = false;
    } else {
      data[projectId] = (data[projectId] || 0) + 1;
      liked[projectId] = true;
    }
    localStorage.setItem(`${STORAGE_PREFIX}likes`, JSON.stringify(data));
    localStorage.setItem(`${STORAGE_PREFIX}liked_set`, JSON.stringify(liked));
    return { count: data[projectId], liked: liked[projectId] };
  } catch {
    return { count: 0, liked: false };
  }
};

export const isLiked = (projectId) => {
  try {
    const liked = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}liked_set`) || "{}");
    return !!liked[projectId];
  } catch {
    return false;
  }
};
