import React, { forwardRef } from "react";
import { PatternBackground } from "@shared/ui/patterns";

const ARROW_RIGHT_SVG_PATH = "https://res.cloudinary.com/dahmmlu7u/image/upload/v1775947716/portfolio/public/assets/icons/arrow_right.svg";

// onClick prop'unu ekliyoruz
const PortfolioButton = forwardRef(({ onClick }, ref) => (
  <div className="portfolio-button-container">
    <PatternBackground
      variant="naiveSketch"
      opacity={0.24}
      className="portfolio-button-pattern"
      seed="portfolio-button"
    />
    <button ref={ref} className="portfolio-button" onClick={onClick}>
      Kesfet
      <img
        src={ARROW_RIGHT_SVG_PATH}
        alt="Arrow Right"
        className="portfolio-button-icon"
        width={25}
        height={25}
      />
    </button>
  </div>
));

export default PortfolioButton;
