import React from "react";
import { clsx } from "clsx";
import "./Tag.css";

const Tag = ({ variant = "default", className, children, ...props }) => (
  <span
    className={clsx("ds-tag", `ds-tag--${variant}`, className)}
    {...props}
  >
    {children}
  </span>
);

export default Tag;
