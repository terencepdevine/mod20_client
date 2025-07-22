import { ReactNode } from "react";

import "./Pill.css";

interface PillProps {
  children: ReactNode;
}

const Pill: React.FC<PillProps> = ({ children }) => {
  return (
    <span className="pill">
      {children}
    </span>
  );
};

export default Pill;
