import React, { forwardRef } from "react";
import FormGroup from "../FormGroup/FormGroup";
import Label from "../Label/Label";
import "./Textarea.scss";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  variant?: "default" | "large";
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label = "", placeholder = "Enter text...", rows = 4, ...props }, ref) => {
    const textareaId =
      props.id ||
      props.name ||
      `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <FormGroup>
        {label && <Label htmlFor={textareaId}>{label}</Label>}
        <textarea
          id={textareaId}
          className={`textarea ${props.variant === "large" && "textarea--large"}`}
          ref={ref}
          rows={rows}
          {...props}
          placeholder={placeholder}
        />
      </FormGroup>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
