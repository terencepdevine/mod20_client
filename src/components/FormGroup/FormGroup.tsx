import React from "react";
import "./FormGroup.scss";

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  children,
  className = "",
}) => {
  const classes = `form-group ${className}`.trim();

  return <div className={classes}>{children}</div>;
};

export default FormGroup;