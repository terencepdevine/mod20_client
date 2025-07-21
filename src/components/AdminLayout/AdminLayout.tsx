import { Outlet } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout: React.FC = () => {
  return (
    <>
      <h1>Sidebar</h1>
      <div className="admin-layout">
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
