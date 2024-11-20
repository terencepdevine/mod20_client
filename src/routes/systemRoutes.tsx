import { RouteObject } from "react-router-dom";

import SystemLayout from "../components/SystemLayout";
import System from "../pages/System";
import Systems from "../pages/Systems";
import Role from "../pages/Role";
import Race from "../pages/Race";

import { systemsLoader } from "../loaders/systemsLoader";
import { systemLoader } from "../loaders/systemLoader";
import { systemNavigationLoader } from "../loaders/systemNavigationLoader";
import { roleLoader } from "../loaders/roleLoader";
import { raceLoader } from "../loaders/raceLoader";

const systemRoutes: RouteObject[] = [
  {
    path: "/systems",
    element: <Systems />,
    loader: systemsLoader,
  },
  {
    element: <SystemLayout />,
    loader: systemNavigationLoader,
    children: [
      {
        path: "/systems/:systemId",
        element: <System />,
        loader: systemLoader,
      },
      {
        path: "/systems/:systemId/roles/:roleId",
        element: <Role />,
        loader: roleLoader,
      },
      {
        path: "/systems/:systemId/races/:raceId",
        element: <Race />,
        loader: raceLoader,
      },
    ],
  },
];

export default systemRoutes;
