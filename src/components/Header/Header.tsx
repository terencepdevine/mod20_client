import { Link } from "react-router-dom";

import Search from "../Search/Search";
import NavSocial from "../NavSocial/NavSocial";
import IconD20 from "../icons/IconD20";

import "../../css/Header/Header.css";
import NavUser from "../NavUser/NavUser";

const Header: React.FC = () => {
  return (
    <>
      <header role="header" className="header">
        <div className="header__primary">
          <Link className="logo" to="/">
            <IconD20 className="logo__icon" />
            <h1 className="logo__text">MOD20</h1>
          </Link>
          <nav className="nav-main">
            <ul className="nav-main__list">
              <li className="nav-main__item">
                <Link to="/systems">Systems</Link>
              </li>
            </ul>
          </nav>
          <Search />
        </div>
        <div className="header__secondary">
          <NavSocial />
          <NavUser />
        </div>
      </header>
    </>
  );
};

export default Header;
