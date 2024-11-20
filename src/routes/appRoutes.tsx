import Home from "../pages/Home";
import About from "../pages/About";
import Account from "../pages/Account";
import { RouteObject } from "react-router-dom";

const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/account",
    element: <Account />,
  },
];

export default appRoutes;
