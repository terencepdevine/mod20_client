import { RouteObject } from "react-router-dom";
import { systemsLoader } from "../loaders/systemsLoader";

import AdminSystems from "../pages/admin/AdminSystems";
import AdminSystem from "../pages/admin/AdminSystem";
import AdminSystemNew from "../pages/admin/AdminSystemNew";
import { systemLoader } from "../loaders/systemLoader";
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
    ],
  },
];

export default adminRoutes;
