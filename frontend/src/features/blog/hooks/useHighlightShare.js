import { useState, useEffect } from "react";

export const useHighlightShare = (contentRef) => {
  const [selection, setSelection] = useState({ text: "", x: 0, y: 0, show: false });

  useEffect(() => {
    const handleMouseUp = () => {
      const activeSelection = window.getSelection();
      const text = activeSelection.toString().trim();

      if (!text || !contentRef.current?.contains(activeSelection.anchorNode)) {
        setSelection({ ...selection, show: false });
        return;
      }

      const range = activeSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setSelection({
        text,
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY - 10,
        show: true,
      });
    };

    document.addEventListener("mouseup", handleMouseUp);
    // Hide on scroll to prevent detached tooltips
    document.addEventListener("scroll", () => setSelection((s) => ({ ...s, show: false })));

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("scroll", () => {});
    };
  }, [contentRef]);

  return selection;
};
