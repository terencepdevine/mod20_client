import React from "react";
import "./FormRow.scss";

interface FormRowProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5 | 6 | 7 | 8;
  className?: string;
}

export const FormRow: React.FC<FormRowProps> = ({
  children,
  columns = 2,
  className = "",
}) => {
  const columnClass = columns === 2 ? "" : `form-row--cols-${columns}`;
  const classes = `form-row ${columnClass} ${className}`.trim();

  return <div className={classes}>{children}</div>;
};

export default FormRow;