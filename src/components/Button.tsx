import { Link } from "react-router-dom";

type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  icon?: React.ElementType;
  variant?: "primary" | "full";
  type?: "link" | "submit" | "button";
  to?: string;
  onClick?: () => void;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  children,
  disabled = false,
  icon: Icon,
  onClick,
  type = "link",
  variant,
  to = "/",
  className,
}) => {
  if (type === "submit" || type === "button") {
    return (
      <button
        disabled={disabled}
        type={type}
        onClick={onClick}
        className={`button ${variant === "full" ? "button--full" : ""} ${className || ""}`}
      >
        {Icon && <Icon className="h-6 w-6 fill-sky-500" />}
        {children}
      </button>
    );
  }

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`button ${variant === "full" ? "button--full" : ""} ${className || ""}`}
    >
      {Icon && <Icon className="h-6 w-6 fill-sky-500" />}
      {children}
    </Link>
  );
};

export default Button;
