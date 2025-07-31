import React from "react";
import "./style/About.css";
import smileSvg from "/assets/icons/about/about_header/smile.svg";
// Header Component
const Header = () => {
  return (
    <div className=" header ">
      <img src={smileSvg} alt="smile" />
    </div>
  );
};

export default Header;
