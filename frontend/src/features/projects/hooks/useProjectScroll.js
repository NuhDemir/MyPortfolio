import { useEffect, useRef, useCallback } from "react";
import { PROJECTS_PAGE_SIZE } from "../constants";

export const useProjectScroll = ({ hasMore, loading, loadMore }) => {
  const sentinelRef = useRef(null);

  const handleIntersect = useCallback(
    (entries) => {
      if (entries[0]?.isIntersecting && hasMore && !loading) {
        loadMore();
      }
    },
    [hasMore, loading, loadMore],
  );

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return sentinelRef;
};

export default useProjectScroll;
