import React, { forwardRef } from "react";
import "./Select.css";

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
    return (
      <div className="form-group">
        {label && <label>{label}</label>}
        <select
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
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;