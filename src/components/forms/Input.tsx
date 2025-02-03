import React from "react";
import Label from "./Label";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label = "",
      variant = "default",
      placeholder = "Enter text...",
      type = "text",
      name,
      defaultValue,
      ...rest
    },
    ref,
  ) => {
    return (
      <div className="flex flex-col">
        {label && <Label name={name}>{label}</Label>}
        <input
          type={type}
          id={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          ref={ref}
          className={`rounded-lg bg-gray-900 p-4 outline-none transition-all hover:bg-gray-850 focus:bg-gray-850 ${variant === "large" && "text-2xl"}`}
          {...rest}
        />
      </div>
    );
  },
);

Input.displayName = "Input"; // For debugging purposes

export default Input;
