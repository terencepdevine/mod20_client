import { Outlet } from "react-router-dom";
import Header from "../Header/Header";

import "./AppLayout.css";
import ScrollToHashElement from "../../utils/ScrollToHashElement";

const AppLayout: React.FC = () => {
  return (
    <>
      <ScrollToHashElement />
      <div className="app-layout">
        <Header />
        <Outlet />
      </div>
    </>
  );
};

export default AppLayout;
