import { useState } from "react";
import { Link } from "react-router-dom";

import "./NavUser.css";

const NavUser = () => {
  const [showNav, setShowNav] = useState<boolean>(false);

  const handleClickProfile = () => {
    setShowNav((show) => !show);
  };

  return (
    <nav className="nav-user">
      <button className="profile-img-wrap" onClick={() => handleClickProfile()}>
        <img src="/src/assets/profile-img.png" className="profile-img" />
      </button>

      {showNav && (
        <div className="nav-user__list-wrap">
          <ul className="nav-user__list">
            <li className="nav-user__item">
              <Link to="/" className="nav-user__link">
                User Profile
              </Link>
            </li>
            <li className="nav-user__item">
              <Link to="/" className="nav-user__link">
                Logout
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavUser;
