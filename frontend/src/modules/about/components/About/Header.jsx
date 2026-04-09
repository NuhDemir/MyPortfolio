import React from "react";
import "./style/About.css";

const SMILE_SVG_PATH = "/assets/icons/about/about_header/smile.svg";
// Header Component
const Header = () => {
  return (
    <div className=" header ">
      <img
        src={SMILE_SVG_PATH}
        alt="smile"
        loading="lazy"
        width={849}
        height={144}
      />
    </div>
  );
};

export default Header;
