import React, { useRef } from "react";
import { useGsapAnimation } from "../../hooks/useGsapAnimation.js";
import Title from "./Title.jsx";
import Subtitle from "./Subtitle.jsx";
import AudioControls from "./AudioControls.jsx";
import PortfolioButton from "./PortfolioButton.jsx";
import MainImage from "./MainImage.jsx";

import "./style/Main.css";

const Main = () => {
  const mainRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const audioControlRef = useRef(null);
  const imageRef = useRef(null);

  useGsapAnimation(
    mainRef,
    titleRef,
    subtitleRef,
    buttonRef,
    audioControlRef,
    imageRef
  );

  return (
    <>
      <section ref={mainRef} className="main-container">
        <div className="main-content">
          <Title ref={titleRef} />
          <Subtitle ref={subtitleRef} />
          <AudioControls ref={audioControlRef} />
          <PortfolioButton ref={buttonRef} />
          <div className="portfolio-button-splash" />
        </div>
        <MainImage ref={imageRef} />
      </section>
    </>
  );
};

export default Main;
