import { useState } from "react";
import { Link } from "react-router-dom";

import IconD20 from "./icons/IconD20";
import Navigation from "./Navigation";
import Search from "./Search";
import SocialNavigation from "./NavigationSocial";
import UserMenu from "./UserMenu";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const Header: React.FC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-gray-950 px-4 py-2 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-6">
            <h1>
              <Link
                to="/"
                className="flex items-center gap-2 text-lg font-bold text-gray-100 lg:gap-4 lg:text-2xl"
              >
                <IconD20 />
                MOD20
              </Link>
            </h1>
            <div className="hidden md:block">
              <Navigation />
            </div>
            <Search />
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:block">
              <SocialNavigation />
            </div>
            <div
              className={`w-6 cursor-pointer overflow-clip rounded-lg shadow md:w-11`}
              onClick={() => setShowUserMenu((showUserMenu) => !showUserMenu)}
            >
              <div className="md:hidden">
                {showUserMenu ? (
                  <XMarkIcon className="h-6 w-6 fill-sky-500" />
                ) : (
                  <Bars3Icon className="h-6 w-6 fill-sky-500" />
                )}
              </div>
              <img
                src="/src/assets/profile-img.png"
                className={`hidden h-auto w-full transition-all md:block ${showUserMenu && "opacity-50"}`}
              />
            </div>
          </div>
        </div>
        <div
          className={`${
            showUserMenu
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          } transition-all duration-300`}
        >
          <UserMenu />
        </div>
      </header>
    </>
  );
};

export default Header;
