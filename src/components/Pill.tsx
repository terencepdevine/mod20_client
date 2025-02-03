import { ReactNode } from "react";

interface PillProps {
  children: ReactNode;
  bg?: string;
  color?: string;
}

const Pill: React.FC<PillProps> = ({ children, bg, color }) => {
  return (
    <span
      className={`rounded-sm ${bg ? bg : "bg-gray-950"} ${color ? color : "text-sky-500"} px-2 py-1 text-xs uppercase tracking-wider`}
    >
      {children}
    </span>
  );
};

export default Pill;
