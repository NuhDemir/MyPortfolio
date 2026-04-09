import React, { forwardRef } from "react";

const Subtitle = forwardRef((_, ref) => (
  <p ref={ref} className="main-subtitle">
    <span className="main-subtitle-text">
      Frontend Developer & Mobile Developer
    </span>
    <span className="main-subtitle-spark" aria-hidden="true">
      ~
    </span>
  </p>
));

export default Subtitle;
