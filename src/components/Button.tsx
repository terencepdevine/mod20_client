import { Link } from "react-router-dom";

type ButtonProps = {
  children: React.ReactNode;
  icon?: React.ElementType;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({ children, icon: Icon, onClick }) => {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="flex items-center gap-4 rounded-lg bg-gray-900 px-4 py-2 font-bold hover:border-gray-700"
    >
      {Icon && <Icon className="h-6 w-6 fill-sky-500" />}
      {children}
    </Link>
  );
};

export default Button;
