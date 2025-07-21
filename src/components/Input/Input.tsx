import React, { forwardRef } from "react";
import "./Input.css";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  variant?: "default" | "large";
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label = "", placeholder = "Enter text...", ...props }, ref) => {
    return (
      <div className="form-group">
        {label && <label>{label}</label>}
        <input
          className={`input ${props.variant === "large" && "input--large"}`}
          ref={ref}
          {...props}
          placeholder={placeholder}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;

// import React from "react";
// import Label from "./Label";

// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   variant?: string;
// }

// const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   (
//     {
//       label = "",
//       variant = "default",
//       placeholder = "Enter text...",
//       type = "text",
//       name,
//       defaultValue,
//       ...rest
//     },
//     ref,
//   ) => {
//     return (
//       <div className="flex flex-col">
//         {label && <Label name={name}>{label}</Label>}
//         <input
//           type={type}
//           id={name}
//           defaultValue={defaultValue}
//           placeholder={placeholder}
//           ref={ref}
//           className={`rounded-lg bg-gray-900 p-4 outline-hidden transition-all hover:bg-gray-850 focus:bg-gray-850 ${variant === "large" && "text-2xl"}`}
//           {...rest}
//         />
//       </div>
//     );
//   },
// );

// export default Input;
