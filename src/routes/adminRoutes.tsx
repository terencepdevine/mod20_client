import { RouteObject } from "react-router-dom";
import { systemsLoader } from "../loaders/systemsLoader";

import AdminSystems from "../pages/admin/AdminSystems";
import AdminSystem from "../pages/admin/AdminSystem";
import AdminSystemNew from "../pages/admin/AdminSystemNew";
import AdminRole from "../pages/admin/AdminRole";
import AdminRoleNew from "../pages/admin/AdminRoleNew";
import AdminRace from "../pages/admin/AdminRace";
import AdminRaceNew from "../pages/admin/AdminRaceNew";
import { systemLoader } from "../loaders/systemLoader";
import { roleLoader } from "../loaders/roleLoader";
import { raceLoader } from "../loaders/raceLoader";
import AdminLayout from "../components/AdminLayout/AdminLayout";

const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "systems",
        element: <AdminSystems />,
        loader: systemsLoader,
      },
      {
        path: "systems/new",
        element: <AdminSystemNew />,
      },
      {
        path: "systems/:systemSlug",
        element: <AdminSystem />,
        loader: systemLoader,
      },
      {
        path: "systems/:systemSlug/roles/new",
        element: <AdminRoleNew />,
        loader: systemLoader,
      },
      {
        path: "systems/:systemSlug/roles/:sectionSlug",
        element: <AdminRole />,
        loader: roleLoader,
      },
      {
        path: "systems/:systemSlug/races/new",
        element: <AdminRaceNew />,
        loader: systemLoader,
      },
      {
        path: "systems/:systemSlug/races/:sectionSlug",
        element: <AdminRace />,
        loader: raceLoader,
      },
    ],
  },
];

export default adminRoutes;
