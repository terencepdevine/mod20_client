import SidebarNavigation from "./SidebarNavigation";
import "./Sidebar.scss";

const Sidebar: React.FC = () => {
  return (
    <aside className="main__sidebar">
      <div className="main__sidebar-top">
        <h1>Sidebar Top</h1>
      </div>
      <div className="main__sidebar-content">
        <SidebarNavigation />
      </div>
      <div className="main__sidebar-bottom">
        <h1>Sidebar Bottom</h1>
      </div>
    </aside>
  );
};

export default Sidebar;
