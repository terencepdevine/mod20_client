import React, { forwardRef } from "react";
import FormGroup from "../FormGroup/FormGroup";
import Label from "../Label/Label";
import "./Select.scss";

export interface SelectOption {
  value: string;
  label: string;
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  variant?: "default" | "large";
  options: SelectOption[];
  placeholder?: string;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label = "", options, placeholder, ...props }, ref) => {
    const selectId =
      props.id ||
      props.name ||
      `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <FormGroup>
        {label && <Label htmlFor={selectId}>{label}</Label>}
        <select
          id={selectId}
          className={`select ${props.variant === "large" && "select--large"}`}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormGroup>
    );
  },
);

Select.displayName = "Select";

export default Select;
