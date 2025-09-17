import { useState } from "react";
import { Outlet, useParams, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
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

  // Create admin navigation structure using the same pattern as SidebarNavigation
  const adminNavigation = [
    {
      name: "System",
      slug: "system",
      children: [
        { name: "Settings", slug: systemSlug || "" },
        { name: "Panic", slug: "panic" }
      ]
    },
    {
      name: "Roles",
      slug: "roles",
      children: [
        ...(system.character?.roles?.map((role: RoleType) => ({
          name: role.name,
          slug: role.slug
        })) || []),
        { name: "+ Add Role", slug: "new", isAddButton: true }
      ]
    },
    {
      name: "Races", 
      slug: "races",
      children: [
        ...(system.character?.races?.map((race: RaceType) => ({
          name: race.name,
          slug: race.slug
        })) || []),
        { name: "+ Add Race", slug: "new", isAddButton: true }
      ]
    },
    {
      name: "Traits",
      slug: "traits", 
      children: [
        { name: "Manage Traits", slug: "" },
        { name: "+ Add Trait", slug: "new", isAddButton: true }
      ]
    }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__section">
        <Link to={`/admin/systems`}>← Back to Systems</Link>
        <h2>System: {system.name}</h2>
      </div>

      <nav className="nav-sidebar">
        <ul className="nav-sidebar__list">
          {adminNavigation.map((item, index) => (
            <AdminSidebarNavigationItem
              key={index}
              systemSlug={systemSlug || ""}
              item={item}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// Admin-specific version of SidebarNavigationItem that generates admin routes
interface AdminSidebarNavigationItemProps {
  systemSlug: string;
  item: {
    name: string;
    slug: string;
    children?: {
      name: string;
      slug: string;
      isAddButton?: boolean;
    }[];
  };
}

const AdminSidebarNavigationItem: React.FC<AdminSidebarNavigationItemProps> = ({
  systemSlug,
  item,
}) => {
  const [active, setActive] = useState<boolean>(false);
  const { sectionSlug } = useParams();

  const handleClick = () => {
    setActive((s) => !s);
  };

  const generateAdminLink = (parentSlug: string, childSlug: string) => {
    if (parentSlug === "system") {
      if (childSlug === systemSlug) {
        return `/admin/systems/${systemSlug}`;
      }
      return `/admin/systems/${systemSlug}/${childSlug}`;
    }
    if (parentSlug === "traits" && childSlug === "") {
      return `/admin/systems/${systemSlug}/traits`;
    }
    return `/admin/systems/${systemSlug}/${parentSlug}/${childSlug}`;
  };

  return (
    <li
      className={`nav-sidebar__item ${active ? "nav-sidebar__item--active" : ""}`}
    >
      <button className="nav-sidebar__link" onClick={handleClick}>
        {item.name}
        <ChevronDownIcon className="nav-sidebar__link-arrow" />
      </button>

      <AnimatePresence initial={false}>
        {item.children && active && (
          <motion.ul
            className="nav-sidebar__sub-list"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.12, ease: "easeInOut" }}
          >
            {item.children.map((child) => (
              <li
                key={child.slug}
                className={`nav-sidebar__sub-item ${child.isAddButton ? "nav-sidebar__sub-item--add-button" : ""} ${sectionSlug === child.slug ? "nav-sidebar__sub-item--active" : ""}`}
              >
                <Link
                  to={generateAdminLink(item.slug, child.slug)}
                  className={`nav-sidebar__sub-link ${child.isAddButton ? "nav-sidebar__sub-link--add-button" : ""}`}
                >
                  {child.name}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

export default AdminLayout;
