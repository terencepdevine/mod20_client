import { Outlet, useParams, Link, useLocation } from "react-router-dom";
import { SystemProvider } from "../../provider/SystemProvider";
import { useSystem } from "../../hooks/useProvider";
import "./AdminLayout.scss";

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { systemSlug } = useParams<{ systemSlug: string }>();

  // Check if we're on a system-specific route
  const isSystemRoute =
    location.pathname.includes("/systems/") &&
    systemSlug &&
    systemSlug !== "new";

  if (isSystemRoute) {
    return (
      <SystemProvider systemSlug={systemSlug}>
        <Sidebar />
        <div className="admin-layout">
          <Outlet />
        </div>
      </SystemProvider>
    );
  }

  return (
    <>
      <aside className="sidebar">
        <h1>Admin</h1>
        <nav>
          <ul>
            <li>
              <Link to="/admin/systems">Systems</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="admin-layout">
        <Outlet />
      </div>
    </>
  );
};

const Sidebar: React.FC = () => {
  const { systemSlug } = useParams<{ systemSlug: string }>();
  const { data: system, isPending, isError } = useSystem();

  if (isPending) {
    return (
      <aside className="sidebar">
        <div>Loading system...</div>
      </aside>
    );
  }

  if (isError || !system) {
    return (
      <aside className="sidebar">
        <div>Error loading system</div>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h2>System: {system.name}</h2>
        <nav>
          <ul>
            <li>
              <Link to={`/admin/systems/${systemSlug}`}>System Settings</Link>
            </li>
            <li>
              <Link to={`/admin/systems`}>← Back to Systems</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Roles Section */}
      <div className="sidebar-section">
        <h3>Roles</h3>
        <nav>
          <ul>
            {system.character?.roles?.map((role: any) => (
              <li key={role.slug}>
                <Link to={`/admin/systems/${systemSlug}/roles/${role.slug}`}>
                  {role.name}
                </Link>
              </li>
            ))}
            {(!system.character?.roles ||
              system.character.roles.length === 0) && (
              <li>No roles available</li>
            )}
            <li>
              <Link to={`/admin/systems/${systemSlug}/roles/new`}>
                + Add Role
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Races Section */}
      <div className="sidebar-section">
        <h3>Races</h3>
        <nav>
          <ul>
            {system.character?.races?.map((race: any) => (
              <li key={race.slug}>
                <Link to={`/admin/systems/${systemSlug}/races/${race.slug}`}>
                  {race.name}
                </Link>
              </li>
            ))}
            {(!system.character?.races ||
              system.character.races.length === 0) && (
              <li>No races available</li>
            )}
            <li>
              <Link to={`/admin/systems/${systemSlug}/races/new`}>
                + Add Race
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* System Info */}
      <div className="sidebar-section">
        <h4>System Info</h4>
        <p>
          <strong>Version:</strong> {system.version || "N/A"}
        </p>
        <p>
          <strong>Slug:</strong> {system.slug}
        </p>
      </div>
    </aside>
  );
};

export default AdminLayout;
