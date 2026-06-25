import { useState, useEffect, useCallback, useRef } from "react";
import { fetchResources } from "../services/resourceService.js";

export const useResources = (initialFilters = {}) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const abortRef = useRef(null);

  const load = useCallback(async (signal) => {
    setLoading(true);
    try {
      const data = await fetchResources({ signal, filters });
      setResources(data);
    } catch {
      // fallback handled in service
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return { resources, loading, filters, setFilters };
};

export default useResources;
