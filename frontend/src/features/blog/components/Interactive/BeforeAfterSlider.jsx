import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import "./BeforeAfterSlider.css";

const BeforeAfterSlider = memo(({ beforeSrc, afterSrc, beforeLabel = "Once", afterLabel = "Sonra" }) => {
  const [position, setPosition] = useState(50); // 0-100 %
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const calcPosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    calcPosition(e.clientX);
  }, [calcPosition]);

  const handleTouchStart = useCallback((e) => {
    setIsDragging(true);
    calcPosition(e.touches[0].clientX);
  }, [calcPosition]);

  useEffect(() => {
    const handleMouseMove = (e) => { if (isDragging) calcPosition(e.clientX); };
    const handleTouchMove = (e) => { if (isDragging) calcPosition(e.touches[0].clientX); };
    const stopDrag = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", stopDrag);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", stopDrag);
    };
  }, [isDragging, calcPosition]);

  if (!beforeSrc || !afterSrc) return null;

  return (
    <div
      ref={containerRef}
      className={`bas-wrap ${isDragging ? "bas-wrap--dragging" : ""}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      role="slider"
      aria-valuenow={Math.round(position)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Once Sonra Kaydirici"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPosition(p => Math.max(0, p - 5));
        if (e.key === "ArrowRight") setPosition(p => Math.min(100, p + 5));
      }}
    >
      {/* After image (full width, behind) */}
      <img src={afterSrc} alt={afterLabel} className="bas-img bas-img--after" draggable={false} />

      {/* Before image (clipped) */}
      <div className="bas-before-clip" style={{ width: `${position}%` }}>
        <img src={beforeSrc} alt={beforeLabel} className="bas-img bas-img--before" draggable={false} />
      </div>

      {/* Divider */}
      <div className="bas-divider" style={{ left: `${position}%` }}>
        <div className="bas-handle">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 10l-4 0M7 10l-2-2M7 10l-2 2M13 10l4 0M13 10l2-2M13 10l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="bas-label bas-label--before">{beforeLabel}</span>
      <span className="bas-label bas-label--after">{afterLabel}</span>
    </div>
  );
});

BeforeAfterSlider.displayName = "BeforeAfterSlider";
export default BeforeAfterSlider;
