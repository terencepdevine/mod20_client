import React from "react";
import "./FormDetails.scss";

interface FormDetailsProps {
  children: React.ReactNode;
  className?: string;
}

const FormDetails: React.FC<FormDetailsProps> = ({ children, className }) => {
  return (
    <div className={`form-details${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
};

export default FormDetails;