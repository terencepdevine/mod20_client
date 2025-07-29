import { Link } from "react-router-dom";
import "./Button.scss";

type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  icon?: React.ElementType;
  variant?: "primary" | "full" | "outline" | "danger";
  size?: "sm" | "base" | "lg" | "xl";
  type?: "link" | "submit" | "button";
  to?: string;
  onClick?: () => void;
  className?: string;
  id?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  icon: Icon,
  onClick,
  type = "link",
  variant,
  size = "base",
  to = "/",
  className,
  id,
}) => {
  // Generate button classes
  const buttonClasses = [
    "button",
    size !== "base" ? `button--${size}` : "",
    variant === "full" ? "button--full" : "",
    variant === "outline" ? "button--outline" : "",
    variant === "danger" ? "button--danger" : "",
    className || ""
  ].filter(Boolean).join(" ");

  // Generate icon size classes based on button size
  const getIconClasses = () => {
    const sizeMap = {
      sm: "h-4 w-4",
      base: "h-5 w-5", 
      lg: "h-6 w-6",
      xl: "h-7 w-7"
    };
    return `${sizeMap[size]} fill-sky-500`;
  };

  if (type === "submit" || type === "button") {
    return (
      <button
        id={id}
        disabled={disabled}
        type={type}
        onClick={onClick}
        className={buttonClasses}
      >
        {Icon && <Icon className={getIconClasses()} />}
        {children}
      </button>
    );
  }

  return (
    <Link
      to={to}
      onClick={onClick}
      className={buttonClasses}
    >
      {Icon && <Icon className={getIconClasses()} />}
      {children}
    </Link>
  );
};

export default Button;
