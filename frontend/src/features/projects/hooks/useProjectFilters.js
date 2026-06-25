import { useState, useCallback, useMemo } from "react";
import { FALLBACK_PROJECTS } from "../services/projectService.js";
import { collectAllTags, collectFilterOptions } from "../utils/projectFormatters.js";
import { TAG_CLOUD_MAX } from "../constants";

export const useProjectFilters = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [sortKey, setSortKey] = useState("featured");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [caseStudyOnly, setCaseStudyOnly] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [visibleItems, setVisibleItems] = useState(6);

  const filterOptions = useMemo(() => collectFilterOptions(FALLBACK_PROJECTS), []);
  const allTags = useMemo(() => collectAllTags(FALLBACK_PROJECTS).slice(0, TAG_CLOUD_MAX), []);

  const toggleTag = useCallback((tagName) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName],
    );
  }, []);

  const clearFilters = useCallback(() => {
    setQuery("");
    setStatus("all");
    setPlatform("all");
    setDifficulty("all");
    setSortKey("featured");
    setFeaturedOnly(false);
    setCaseStudyOnly(false);
    setSelectedTags([]);
  }, []);

  const filters = {
    query,
    status,
    platform,
    difficulty,
    sortKey,
    featuredOnly,
    caseStudyOnly,
    selectedTags,
  };

  return {
    query, setQuery,
    status, setStatus,
    platform, setPlatform,
    difficulty, setDifficulty,
    sortKey, setSortKey,
    featuredOnly, setFeaturedOnly,
    caseStudyOnly, setCaseStudyOnly,
    selectedTags, toggleTag,
    visibleItems, setVisibleItems,
    filters,
    filterOptions,
    allTags,
    clearFilters,
  };
};

export default useProjectFilters;
