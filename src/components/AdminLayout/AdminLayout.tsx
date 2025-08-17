import { Outlet, useParams, Link, useLocation } from "react-router-dom";
import { SystemProvider } from "../../provider/SystemProvider";
import { useSystem } from "../../hooks/useProvider";
import "./AdminLayout.scss";
import Button from "../Button/Button";
import { RaceType, RoleType } from "@mod20/types";

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { systemSlug } = useParams<{ systemSlug: string }>();

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
      <div className="sidebar__section">
        <Link to={`/admin/systems`}>← Back to Systems</Link>
        <h2>System: {system.name}</h2>
        <nav>
          <ul>
            <li>
              <Link to={`/admin/systems/${systemSlug}`}>System Settings</Link>
            </li>
            <li></li>
          </ul>
        </nav>
      </div>

      <div className="sidebar__section">
        <h3>Roles</h3>
        <nav className="sidebar__nav">
          <ul className="sidebar__nav-list">
            {system.character?.roles?.map((role: RoleType) => (
              <li key={role.slug} className="sidebar__nav-item">
                <Link
                  to={`/admin/systems/${systemSlug}/roles/${role.slug}`}
                  className="sidebar__nav-link"
                >
                  {role.name}
                </Link>
              </li>
            ))}
            {(!system.character?.roles ||
              system.character.roles.length === 0) && (
              <li>No roles available</li>
            )}
            <li>
              <Button
                to={`/admin/systems/${systemSlug}/roles/new`}
                variant="outline"
              >
                + Add Role
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="sidebar__section">
        <h3>Races</h3>
        <nav>
          <ul>
            {system.character?.races?.map((race: RaceType) => (
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
              <Button
                to={`/admin/systems/${systemSlug}/races/new`}
                variant="outline"
              >
                + Add Race
              </Button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="sidebar__section">
        <h3>Traits</h3>
        <nav>
          <ul>
            <li>
              <Link to={`/admin/systems/${systemSlug}/traits`}>
                Manage Traits
              </Link>
            </li>
            <li>
              <Button
                to={`/admin/systems/${systemSlug}/traits/new`}
                variant="outline"
              >
                + Add Trait
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AdminLayout;
