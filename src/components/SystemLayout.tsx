import { Outlet, useParams } from "react-router-dom";
import { SystemNavigationProvider } from "../provider/SystemNavigationProvider";
import Sidebar from "./Sidebar";

const SystemLayout: React.FC = () => {
  const { systemId } = useParams();

  if (!systemId) {
    return <h1>Error: Missing system ID</h1>;
  }

  return (
    <SystemNavigationProvider systemId={systemId}>
      <Sidebar />
      <Outlet />
    </SystemNavigationProvider>
  );
};

export default SystemLayout;
