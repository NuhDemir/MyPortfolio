import React from "react";
import { clsx } from "clsx";
import "./layout.css";

export const Container = ({ narrow, wide, flush, className, children, ...props }) => (
  <div
    className={clsx(
      "ds-container",
      narrow && "ds-container--narrow",
      wide && "ds-container--wide",
      flush && "ds-container--flush",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const Stack = ({
  vertical = true,
  wrap = false,
  center = false,
  between = false,
  gap,
  className,
  children,
  ...props
}) => (
  <div
    className={clsx(
      "ds-stack",
      vertical ? "ds-stack--vertical" : "ds-stack--horizontal",
      wrap && "ds-stack--wrap",
      center && "ds-stack--center",
      between && "ds-stack--between",
      gap && `ds-stack--gap-${gap}`,
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const Grid = ({ cols = "auto", gap, dense, className, children, ...props }) => (
  <div
    className={clsx(
      "ds-grid",
      `ds-grid--${cols}`,
      gap && `ds-grid--gap-${gap}`,
      dense && "ds-grid--dense",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const Section = ({ size, className, children, ...props }) => (
  <section
    className={clsx(
      "ds-section",
      size && `ds-section--${size}`,
      className
    )}
    {...props}
  >
    {children}
  </section>
);
