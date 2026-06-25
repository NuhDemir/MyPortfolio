import React from "react";
import { clsx } from "clsx";
import "./Button.css";

const Button = React.forwardRef(
  (
    {
      as: Component,
      variant = "primary",
      size,
      icon: IconComp,
      iconPosition = "start",
      full = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    if (!Component) {
      Component = props.href ? "a" : "button";
    }

    return (
      <Component
        ref={ref}
        className={clsx(
          "ds-btn",
          `ds-btn--${variant}`,
          size && `ds-btn--${size}`,
          !children && IconComp && "ds-btn--icon",
          full && "ds-btn--full",
          className
        )}
        {...props}
      >
        {IconComp && iconPosition === "start" && (
          <IconComp className="ds-btn__icon ds-btn__icon--start" />
        )}
        {children && <span>{children}</span>}
        {IconComp && iconPosition === "end" && (
          <IconComp className="ds-btn__icon ds-btn__icon--end" />
        )}
      </Component>
    );
  }
);

Button.displayName = "Button";

export default Button;
