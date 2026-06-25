import { useState, useEffect, useMemo } from "react";
import { fetchProjects, FALLBACK_PROJECTS } from "../services/projectService.js";
import { POLL_INTERVAL_MS } from "../constants";
import { sortProjects, filterProjects } from "../utils/projectFormatters.js";

export const useProjectData = ({ filters = {} } = {}) => {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);

  const filterKey = useMemo(
    () => JSON.stringify(filters),
    [filters?.query, filters?.status, filters?.platform, filters?.difficulty, filters?.sortKey, filters?.featuredOnly, filters?.caseStudyOnly, JSON.stringify(filters?.selectedTags)],
  );

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
  }, [filterKey]);

  const processed = useMemo(
    () => sortProjects(filterProjects(projects, filters), filters.sortKey || "featured"),
    [projects, filterKey],
  );

  return { projects, processed };
};

export default useProjectData;
