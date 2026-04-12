import { useCallback, useEffect, useMemo, useState } from "react";

const clampIndex = (index, total) => {
  if (!Number.isFinite(index) || total <= 0) return 0;
  return Math.min(Math.max(Math.trunc(index), 0), total - 1);
};

const wrapIndex = (index, total) => {
  if (total <= 0) return 0;
  const normalized = index % total;
  return normalized < 0 ? normalized + total : normalized;
};

export const useProjectViewer = ({ projects = [] } = {}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOn, setIsOn] = useState(true);

  const safeProjects = useMemo(
    () => (Array.isArray(projects) ? projects : []),
    [projects],
  );
  const total = safeProjects.length;

  useEffect(() => {
    if (total === 0) {
      setActiveIndex(0);
      return;
    }

    setActiveIndex((current) => clampIndex(current, total));
  }, [total]);

  const goTo = useCallback(
    (index) => {
      if (total === 0) return;
      setActiveIndex(clampIndex(index, total));
    },
    [total],
  );

  const next = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((current) => wrapIndex(current + 1, total));
  }, [total]);

  const prev = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((current) => wrapIndex(current - 1, total));
  }, [total]);

  const toggle = useCallback(() => {
    setIsOn((current) => !current);
  }, []);

  const safeIndex = clampIndex(activeIndex, total || 1);
  const project = total > 0 ? safeProjects[safeIndex] || null : null;

  return {
    activeIndex: safeIndex,
    total,
    project,
    goTo,
    next,
    prev,
    isOn,
    toggle,
  };
};
