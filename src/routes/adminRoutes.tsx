import { RouteObject } from "react-router-dom";
import { systemsLoader } from "../loaders/systemsLoader";

import AdminLayout from "../components/layout/AdminLayout";
import AdminSystems from "../pages/admin/AdminSystems";
import AdminSystem from "../pages/admin/AdminSystem";
import AdminSystemNew from "../pages/admin/AdminSystemNew";

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
        path: "systems/:systemId",
        element: <AdminSystem />,
      },
      {
        path: "systems/new",
        element: <AdminSystemNew />,
      },
    ],
  },
];

export default adminRoutes;
