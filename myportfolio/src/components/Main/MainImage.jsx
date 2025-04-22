import React, { forwardRef } from "react";
import MainSvg from "../../assets/main/main.svg";

const MainImage = forwardRef((props, ref) => {
  return (
    <div ref={ref} className="main-image">
      <img src={MainSvg} alt="Developer working with retro computers" />
    </div>
  );
});

export default MainImage;
