import { RouteObject } from "react-router-dom";
import { systemsLoader } from "../loaders/systemsLoader";

import AdminSystems from "../pages/admin/AdminSystems";
import AdminSystem from "../pages/admin/AdminSystem";
import AdminSystemNew from "../pages/admin/AdminSystemNew";
import AdminRole from "../pages/admin/AdminRole";
import { systemLoader } from "../loaders/systemLoader";
import { roleLoader } from "../loaders/roleLoader";
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
        path: "systems/:systemSlug",
        element: <AdminSystem />,
        loader: systemLoader,
      },
      {
        path: "systems/new",
        element: <AdminSystemNew />,
      },
      {
        path: "systems/:systemSlug/roles/:sectionSlug",
        element: <AdminRole />,
        loader: roleLoader,
      },
    ],
  },
];

export default adminRoutes;
