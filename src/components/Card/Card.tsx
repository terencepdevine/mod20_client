import "./Card.scss";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ children, className }) => {
  return <div className={`card${className ? ` ${className}` : ""}`}>{children}</div>;
};

export default Card;
