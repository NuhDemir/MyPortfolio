import React from "react";
import { useScrollProgress } from "../../hooks/useScrollProgress";
import "./ReadingProgress.css";

export const ReadingProgress = () => {
  const progress = useScrollProgress();

  return (
    <div className="reading-progress-container">
      <div 
        className="reading-progress-bar" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
};

export default ReadingProgress;
