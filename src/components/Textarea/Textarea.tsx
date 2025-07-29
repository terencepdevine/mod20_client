import React, { forwardRef } from "react";
import Label from "../forms/Label";
import "./Textarea.css";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  variant?: "default" | "large";
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label = "", placeholder = "Enter text...", rows = 4, ...props }, ref) => {
    const textareaId = props.id || props.name || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="form-group">
        {label && <Label htmlFor={textareaId}>{label}</Label>}
        <textarea
          id={textareaId}
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