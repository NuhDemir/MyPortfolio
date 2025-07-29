import React, { forwardRef } from "react";
import arrow_rightSvg from "../../../public/icons/arrow_right.svg";
// import vaultSvg from "/icons/icons/vault.svg";

const PortfolioButton = forwardRef((_, ref) => (
  <div className="portfolio-button-container">
    <button ref={ref} className="portfolio-button">
      See Portfolio
      <img src={arrow_rightSvg} alt="Arrow Right" className="icon" />
    </button>
    {/* <img src={vaultSvg} alt="Vault" className="icon" /> */}
  </div>
));

export default PortfolioButton;
