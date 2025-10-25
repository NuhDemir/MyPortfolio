import React, { forwardRef } from "react";

const Subtitle = forwardRef((_, ref) => (
  <p ref={ref} className="main-subtitle">
    Frontend Developer & Mobile Developer
  </p>
));

export default Subtitle;
