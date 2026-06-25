import { useState, useEffect } from "react";
import { fetchProjects, FALLBACK_PROJECTS } from "../services/projectService.js";
import { POLL_INTERVAL_MS } from "../constants";
import { sortProjects, filterProjects } from "../utils/projectFormatters.js";

export const useProjectData = ({ filters = {} } = {}) => {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetchProjects({
          signal: controller.signal,
          filters,
          includeSource: true,
        });
        if (!isMounted) return;
        const data = Array.isArray(response?.items) ? response.items : [];
        setProjects(data.length > 0 ? data : FALLBACK_PROJECTS);
      } catch {
        if (!isMounted) return;
        setProjects(FALLBACK_PROJECTS);
      }
    };

    load();
    const intervalId = window.setInterval(load, POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, [JSON.stringify(filters)]);

  const processed = sortProjects(
    filterProjects(projects, filters),
    filters.sortKey || "featured",
  );

  return { projects, processed };
};

export default useProjectData;
