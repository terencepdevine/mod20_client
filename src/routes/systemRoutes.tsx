import { RouteObject } from "react-router-dom";

import SystemLayout from "../components/Layout/SystemLayout";
import System from "../pages/System";
import Systems from "../pages/Systems";
import Role from "../pages/Role/Role";
import Race from "../pages/Race/Race";
import Trait from "../pages/Trait";

import { systemsLoader } from "../loaders/systemsLoader";
import Roles from "../pages/Roles";

import { roleLoader } from "../loaders/roleLoader";
import { raceLoader } from "../loaders/raceLoader";
import { traitLoader } from "../loaders/traitLoader";
import { rolesLoader } from "../loaders/rolesLoader";

const systemRoutes: RouteObject[] = [
  {
    path: "/systems",
    element: <Systems />,
    loader: systemsLoader,
  },
  {
    path: "/systems/:systemSlug",
    element: <SystemLayout />,
    // loader: systemNavigationLoader,
    children: [
      {
        path: "",
        element: <System />,
        // loader: systemLoader,
      },
      {
        path: "roles",
        element: <Roles />,
        loader: rolesLoader,
      },
      {
        path: "roles/:sectionSlug",
        element: <Role />,
        loader: roleLoader,
      },
      {
        path: "races/:sectionSlug",
        element: <Race />,
        loader: raceLoader,
      },
      {
        path: "traits/:sectionSlug",
        element: <Trait />,
        loader: traitLoader,
      },
    ],
  },
];

export default systemRoutes;
