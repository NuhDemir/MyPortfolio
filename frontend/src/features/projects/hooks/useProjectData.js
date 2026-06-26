import { useState, useEffect, useMemo } from "react";
import { fetchProjects } from "../services/projectService.js";
import { POLL_INTERVAL_MS, TAG_CLOUD_MAX } from "../constants";
import { sortProjects, filterProjects, collectFilterOptions, collectAllTags } from "../utils/projectFormatters.js";

export const useProjectData = ({ filters = {} } = {}) => {
  const [projects, setProjects] = useState([]);

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
        setProjects(data);
      } catch {
        if (!isMounted) return;
        setProjects([]);
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

  const filterOptions = useMemo(() => collectFilterOptions(projects), [projects]);
  const allTags = useMemo(() => collectAllTags(projects).slice(0, TAG_CLOUD_MAX), [projects]);

  return { projects, processed, filterOptions, allTags };
};

export default useProjectData;
