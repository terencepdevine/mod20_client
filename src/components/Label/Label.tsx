import React from "react";

import "./Label.scss";

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  name?: string; // Keep for backward compatibility
  description?: string;
}

const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  name,
  className = "",
  description,
}) => {
  return (
    <div className="label">
      <label htmlFor={htmlFor || name} className={`label__text ${className}`}>
        {children}
      </label>
      {description && <div className="label__description">{description}</div>}
    </div>
  );
};

export default Label;
