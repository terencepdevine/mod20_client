import { Link } from "react-router-dom";

import {
  ArrowLeftEndOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/16/solid";
import SocialNavigation from "./NavigationSocial";
import Navigation from "./Navigation";
import DropdownTheme from "./DropdownTheme";

const UserMenu: React.FC = () => {
  const navItems = [
    {
      name: "Account",
      icon: <UserCircleIcon />,
      to: "/account",
    },
    {
      name: "Logout",
      icon: <ArrowLeftEndOnRectangleIcon />,
      to: "/",
    },
  ];

  return (
    <div className="absolute left-auto right-0 top-full z-20 -mr-2 mt-4 flex w-[240px] flex-col rounded-lg bg-gray-900 bg-opacity-95 p-2 shadow-lg backdrop-blur-md lg:right-0 lg:rounded-lg">
      <div className="mb-2 border-b-1 border-b-gray-800 pb-2 md:hidden">
        <Navigation />
      </div>
      <nav>
        <ul className="flex flex-col gap-1">
          {navItems.map((item, i) => {
            return (
              <li key={i}>
                <Link
                  to={item.to}
                  className="flex items-center gap-2 rounded-sm px-2 py-2 text-sm text-gray-300 hover:bg-gray-925"
                >
                  <div className="h-4 w-4 text-sky-500">{item.icon}</div>
                  {item.name}
                </Link>
              </li>
            );
          })}
          <li>
            <DropdownTheme />
          </li>
        </ul>
      </nav>
      <div className="p-2 pt-3 lg:hidden">
        <SocialNavigation />
      </div>
    </div>
  );
};

export default UserMenu;
