import React, { forwardRef } from "react";
import "./Textarea.css";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  variant?: "default" | "large";
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label = "", placeholder = "Enter text...", rows = 4, ...props }, ref) => {
    return (
      <div className="form-group">
        {label && <label>{label}</label>}
        <textarea
          className={`textarea ${props.variant === "large" && "textarea--large"}`}
          ref={ref}
          rows={rows}
          {...props}
          placeholder={placeholder}
        />
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;