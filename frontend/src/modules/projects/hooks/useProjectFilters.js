import { useState, useMemo } from "react";
import { FALLBACK_PROJECTS } from "@modules/projects/services/projectService.js";

/**
 * Proje listesinin filtre state'ini ve platformOptions listesini yönetir.
 */
export const useProjectFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const platformOptions = useMemo(() => {
    const options = new Set();
    FALLBACK_PROJECTS.forEach((project) => {
      const platform =
        project?.metadata?.platform || project?.platform || project?.category;
      if (platform && String(platform).trim()) {
        options.add(String(platform).trim());
      }
    });
    return ["all", ...Array.from(options).sort((a, b) => a.localeCompare(b))];
  }, []);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPlatformFilter("all");
    setFeaturedOnly(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    platformFilter,
    setPlatformFilter,
    featuredOnly,
    setFeaturedOnly,
    platformOptions,
    clearFilters,
  };
};
