import React, { forwardRef } from "react";
import arrow_rightSvg from "/assets/icons/arrow_right.svg";

// onClick prop'unu ekliyoruz
const PortfolioButton = forwardRef(({ onClick }, ref) => (
  <div className="portfolio-button-container">
    <button ref={ref} className="portfolio-button" onClick={onClick}>
      Keşfet
      <img
        src={arrow_rightSvg}
        alt="Arrow Right"
        className="icon"
        width={25}
        height={25}
      />
    </button>
  </div>
));

export default PortfolioButton;
