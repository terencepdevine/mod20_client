import React, { forwardRef } from "react";
import FormGroup from "../FormGroup/FormGroup";
import Label from "../Label/Label";
import "./Checkbox.scss";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  description?: string;
  error?: boolean;
  containerClassName?: string;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
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
      `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    // Build className for checkbox
    const checkboxClasses = [
      "checkbox__input",
      error && "checkbox__input--error",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <FormGroup className={containerClassName}>
        <div className="checkbox">
          <input
            id={inputId}
            type="checkbox"
            className={checkboxClasses}
            ref={ref}
            {...props}
          />
          {label && (
            <Label htmlFor={inputId} description={description} className="checkbox__label">
              {label}
            </Label>
          )}
        </div>
      </FormGroup>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;