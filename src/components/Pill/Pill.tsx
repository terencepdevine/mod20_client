import { ReactNode } from "react";

import "./Pill.scss";

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
