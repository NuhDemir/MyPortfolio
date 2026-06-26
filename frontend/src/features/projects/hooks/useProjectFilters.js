import { useState, useCallback } from "react";

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
    clearFilters,
  };
};

export default useProjectFilters;
