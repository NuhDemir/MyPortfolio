import { useState, useEffect } from "react";
import {
  FALLBACK_PROJECTS,
  fetchProjects,
} from "@modules/projects/services/projectService.js";

const POLL_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Projeleri backend'den çeker; başarısız olursa sessizce fallback'e düşer.
 * Filtre değerleri değiştikçe yeniden istek atar.
 */
export const useProjectData = ({
  searchQuery,
  statusFilter,
  platformFilter,
  featuredOnly,
}) => {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetchProjects({
          signal: controller.signal,
          filters: {
            q: searchQuery,
            status: statusFilter,
            platform: platformFilter,
            featured: featuredOnly ? true : undefined,
          },
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
    const intervalId = window.setInterval(() => {
      if (isMounted) load();
    }, POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, [featuredOnly, platformFilter, searchQuery, statusFilter]);

  return projects;
};
