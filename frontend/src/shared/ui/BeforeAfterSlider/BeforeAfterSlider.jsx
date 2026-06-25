import { useState } from "react";
import "./BeforeAfterSlider.css";

const BeforeAfterSlider = ({ beforeSrc, afterSrc, beforeAlt, afterAlt }) => {
  const [value, setValue] = useState(55);

  if (!beforeSrc || !afterSrc) return null;

  return (
    <div className="bas" aria-label="Before / After karsilastirma">
      <div className="bas__frame">
        <img
          className="bas__img"
          src={beforeSrc}
          alt={beforeAlt || "Before"}
          loading="lazy"
        />
        <div className="bas__overlay" style={{ width: `${value}%` }}>
          <img
            className="bas__img"
            src={afterSrc}
            alt={afterAlt || "After"}
            loading="lazy"
          />
        </div>
        <div className="bas__handle" style={{ left: `${value}%` }} />
      </div>
      <input
        className="bas__range"
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label="Before/After kaydirici"
      />
    </div>
  );
};

export default BeforeAfterSlider;
