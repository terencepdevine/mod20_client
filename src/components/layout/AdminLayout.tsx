import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  return (
    <>
      <div className="flex w-full flex-col">
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
