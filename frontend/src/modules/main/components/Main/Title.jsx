import React, { forwardRef } from "react";

const Title = forwardRef((_, ref) => (
  <h1 ref={ref} className="main-title">
    NUH DEMiR
  </h1>
));

export default Title;
