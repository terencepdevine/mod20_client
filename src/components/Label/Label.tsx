import React from "react";

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  variant?: "default" | "media-field";
  name?: string; // Keep for backward compatibility
  description?: string;
}

const Label: React.FC<LabelProps> = ({ 
  children, 
  htmlFor, 
  name, 
  className = "", 
  variant = "default",
  description
}) => {
  const baseClasses = variant === "media-field" 
    ? "media-field__label" 
    : "pb-2 text-sm italic text-gray-500";
  
  const combinedClasses = `${baseClasses} ${className}`.trim();
  
  return (
    <div className="label-wrapper">
      <label htmlFor={htmlFor || name} className={combinedClasses}>
        {children}
      </label>
      {description && (
        <p className={variant === "media-field" ? "media-field__description" : "label-description"}>
          {description}
        </p>
      )}
    </div>
  );
};

export default Label;
