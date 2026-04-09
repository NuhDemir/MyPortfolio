import React, { forwardRef } from "react";

const Title = forwardRef((_, ref) => (
  <h1 ref={ref} className="main-title">
    <span className="main-title-text">NUH demir</span>
    <span className="main-title-doodle" aria-hidden="true">
      *
    </span>
  </h1>
));

export default Title;
