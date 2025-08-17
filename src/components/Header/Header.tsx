import { Link } from "react-router-dom";

import Search from "../Search/Search";
import NavSocial from "../NavSocial/NavSocial";
import NavMain from "../NavMain/NavMain";
import IconD20 from "../IconD20/IconD20";
import NavUser from "../NavUser/NavUser";

import "./Header.scss";

const Header: React.FC = () => {
  return (
    <>
      <header role="header" className="header">
        <div className="header__primary">
          <Link className="logo" to="/">
            <IconD20 className="logo__icon" />
            <h1 className="logo__text">MOD20</h1>
          </Link>
          <NavMain />
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
