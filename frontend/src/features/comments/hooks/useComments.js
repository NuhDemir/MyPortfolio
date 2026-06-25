import { useState, useEffect } from "react";
import { fetchPublicComments } from "../services/commentsService.js";

export const useComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const load = async () => {
      const data = await fetchPublicComments(controller.signal);
      if (!cancelled) {
        setComments(data);
        setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; controller.abort(); };
  }, []);

  return { comments, loading };
};
