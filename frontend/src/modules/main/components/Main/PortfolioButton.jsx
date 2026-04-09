import React, { forwardRef } from "react";
import arrow_rightSvg from "/assets/icons/arrow_right.svg";
import { PatternBackground } from "@shared/ui/patterns";

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
        src={arrow_rightSvg}
        alt="Arrow Right"
        className="portfolio-button-icon"
        width={25}
        height={25}
      />
    </button>
  </div>
));

export default PortfolioButton;
