import "./Loading.css";

interface LoadingProps {
  message?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = "Loading...", 
  className = "" 
}) => {
  return (
    <div className={`loading ${className}`}>
      <div className="loading__spinner"></div>
      <div className="loading__message">{message}</div>
    </div>
  );
};

export default Loading;
