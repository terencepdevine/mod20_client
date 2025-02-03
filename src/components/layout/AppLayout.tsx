import { Outlet } from "react-router-dom";
import Header from "../Header";

const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-col lg:min-h-0 lg:flex-1 lg:flex-row">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
