import React from "react";
import "./style/About.css";

const Header = ({ title = "Hakkımda", subtitle = "" }) => (
  <div className="about-header">
    <h1 className="about-header__title">{title}</h1>
    {subtitle ? <p className="about-header__subtitle">{subtitle}</p> : null}
  </div>
);

export default Header;
