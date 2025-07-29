import React from "react";
import "./style/About.css";
import SmileSvg from "/icons/about/about_header/smile.svg";

// Header Component
const Header = () => {
  return (
    <div className=" header ">
      <img src={SmileSvg} alt="smile" />
    </div>
  );
};

export default Header;
