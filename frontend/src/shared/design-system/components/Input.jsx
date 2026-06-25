import React from "react";
import { clsx } from "clsx";
import "./Input.css";

const Input = React.forwardRef(
  ({ error, className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx("ds-input", error && "ds-input--error", className)}
      {...props}
    />
  )
);
Input.displayName = "Input";

const SearchInput = React.forwardRef(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="search"
      className={clsx("ds-input", "ds-input--search", className)}
      {...props}
    />
  )
);
SearchInput.displayName = "SearchInput";

const Textarea = React.forwardRef(
  ({ error, className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={clsx("ds-textarea", error && "ds-input--error", className)}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

const Select = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={clsx("ds-select", className)}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

const Field = ({ label, error, hint, className, children, ...props }) => (
  <label className={clsx("ds-field", className)} {...props}>
    {label && <span className="ds-field__label">{label}</span>}
    {children}
    {error && <span className="ds-field__error">{error}</span>}
    {hint && !error && <span className="ds-field__hint">{hint}</span>}
  </label>
);

export { Input, SearchInput, Textarea, Select, Field };
