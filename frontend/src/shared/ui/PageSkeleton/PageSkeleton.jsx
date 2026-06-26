import React from "react";
import { motion } from "framer-motion";
import "./PageSkeleton.css";

const PageSkeleton = () => {
  return (
    <motion.div
      className="page-skeleton"
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      aria-hidden="true"
    >
      <div className="page-skeleton__hero">
        <div className="page-skeleton__pulse page-skeleton__title" />
        <div className="page-skeleton__pulse page-skeleton__subtitle" />
      </div>
      
      <div className="page-skeleton__grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`skeleton-card-${i}`} className="page-skeleton__card">
            <div className="page-skeleton__pulse page-skeleton__card-image" />
            <div className="page-skeleton__card-body">
              <div className="page-skeleton__pulse page-skeleton__card-text" />
              <div className="page-skeleton__pulse page-skeleton__card-text page-skeleton__card-text--short" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default PageSkeleton;
