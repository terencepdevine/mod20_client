import { Outlet, useParams } from "react-router-dom";
import { SystemNavigationProvider } from "../../provider/SystemNavigationProvider";
import Sidebar from "../Sidebar/Sidebar";

const SystemLayout: React.FC = () => {
  const { systemSlug } = useParams();

  if (!systemSlug) {
    return <h1>Error: Missing system Slug</h1>;
  }

  return (
    <SystemNavigationProvider systemSlug={systemSlug}>
      <Sidebar />
      <Outlet />
    </SystemNavigationProvider>
  );
};

export default SystemLayout;
