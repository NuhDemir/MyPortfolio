import { useState, useEffect } from "react";

export const useTableOfContents = (contentRef) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!contentRef.current) return;

    // Parse headings from the content
    const elements = Array.from(contentRef.current.querySelectorAll("h2, h3"));
    
    // Generate IDs if they don't exist
    const parsedHeadings = elements.map((elem, index) => {
      if (!elem.id) {
        elem.id = `heading-${index}-${elem.innerText.replace(/\\s+/g, "-").toLowerCase()}`;
      }
      return {
        id: elem.id,
        text: elem.innerText,
        level: Number(elem.tagName.replace("H", "")),
      };
    });

    setHeadings(parsedHeadings);

    // Setup Intersection Observer for active heading tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" } // Trigger when heading is near the top
    );

    elements.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, [contentRef]);

  return { headings, activeId };
};
