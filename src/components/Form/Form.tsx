import React from "react";
import "./Form.scss";

interface FormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Form: React.FC<FormProps> = ({
  onSubmit,
  children,
  className,
  style,
}) => {
  return (
    <form onSubmit={onSubmit} className={className} style={style}>
      {children}
    </form>
  );
};

export default Form;
