import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../contexts/ThemeContext";

import "./NavUser.css";

const NavUser = () => {
  const [showNav, setShowNav] = useState<boolean>(false);
  const navRef = useRef<HTMLElement>(null);
  const { theme, toggleTheme } = useTheme();

  const handleClickProfile = () => {
    setShowNav((show) => !show);
  };

  const handleCloseMenu = () => {
    setShowNav(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setShowNav(false);
      }
    };

    if (showNav) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNav]);

  return (
    <nav className="nav-user" ref={navRef}>
      <button className="profile-img-wrap" onClick={() => handleClickProfile()}>
        <img src="/src/assets/profile-img.png" className="profile-img" />
      </button>

      <AnimatePresence>
        {showNav && (
          <motion.div
            className="nav-user__list-wrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
              duration: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <ul className="nav-user__list">
              <li className="nav-user__item">
                <Link
                  to="/account"
                  className="nav-user__link"
                  onClick={handleCloseMenu}
                >
                  User Profile
                </Link>
              </li>
              <li className="nav-user__item">
                <button
                  className="nav-user__link nav-user__theme-toggle"
                  onClick={() => {
                    toggleTheme();
                    handleCloseMenu();
                  }}
                >
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
              </li>
              <li className="nav-user__item">
                <Link
                  to="/"
                  className="nav-user__link"
                  onClick={handleCloseMenu}
                >
                  Logout
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavUser;
