import React, { forwardRef } from "react";
import Label from "../Label/Label";
import "./Input.scss";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  description?: string;
  variant?: "default" | "large";
  error?: boolean;
  containerClassName?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      placeholder,
      variant = "default",
      error = false,
      containerClassName = "",
      className = "",
      ...props
    },
    ref,
  ) => {
    const inputId =
      props.id ||
      props.name ||
      `input-${Math.random().toString(36).substr(2, 9)}`;

    // Build className for input
    const inputClasses = [
      "input",
      variant === "large" && "input--large",
      error && "input--error",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={`form-group ${containerClassName}`.trim()}>
        {label && (
          <Label htmlFor={inputId} description={description}>
            {label}
          </Label>
        )}
        <input
          id={inputId}
          className={inputClasses}
          ref={ref}
          placeholder={placeholder}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
