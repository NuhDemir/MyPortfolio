import React from "react";
import "./style/About.css";
import SmileSvg from "../../assets/icons/about/about_header/smile.svg";

// Header Component
const Header = () => {
  return (
    <div className=" header header-title">
      <img src={SmileSvg} />
    </div>
  );
};

export default Header;
