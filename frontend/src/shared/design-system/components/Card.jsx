import React from "react";
import { clsx } from "clsx";
import "./Card.css";

const Card = React.forwardRef(
  (
    {
      variant = "default",
      bordered = false,
      hover = false,
      sharp = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "ds-card",
          `ds-card--${variant}`,
          bordered && "ds-card--bordered",
          hover && "ds-card--hover",
          !sharp && "ds-card--rounded",
          sharp && "ds-card--sharp",
          variant === "surface" && "ds-card--surface",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

const CardMedia = ({ className, children, ...props }) => (
  <div className={clsx("ds-card__media", className)} {...props}>
    {children}
  </div>
);

const CardBody = ({ tight = false, className, children, ...props }) => (
  <div
    className={clsx(
      "ds-card__body",
      tight && "ds-card__body--tight",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

Card.Media = CardMedia;
Card.Body = CardBody;

export default Card;
