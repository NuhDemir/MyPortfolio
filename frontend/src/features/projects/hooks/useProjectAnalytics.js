import { useState, useCallback } from "react";
import { getViewCount, incrementViewCount, toggleLike, isLiked } from "../utils/analytics.js";

export const useProjectAnalytics = (projectId) => {
  const [views, setViews] = useState(() => getViewCount(projectId));
  const [likes, setLikes] = useState(() => getViewCount(projectId) + 1);
  const [liked, setLiked] = useState(() => isLiked(projectId));

  const recordView = useCallback(() => {
    const count = incrementViewCount(projectId);
    setViews(count);
  }, [projectId]);

  const handleLike = useCallback(() => {
    const result = toggleLike(projectId);
    setLikes(result.count);
    setLiked(result.liked);
  }, [projectId]);

  return { views, likes, liked, recordView, handleLike };
};

export default useProjectAnalytics;
