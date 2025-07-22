import { Link } from "react-router-dom";

import IconYoutube from "../icons/IconYoutube";
import IconTwitch from "../icons/IconTwitch";
import IconDiscord from "../icons/IconDiscord";
import IconInstagram from "../icons/IconInstagram";

import "./NavSocial.css";

const NavSocial = () => {
  return (
    <nav className="nav-social">
      <ul className="nav-social__list">
        <li className="nav-social__item">
          <Link to="/">
            <IconYoutube />
          </Link>
        </li>
        <li className="nav-social__item">
          <Link to="/">
            <IconTwitch />
          </Link>
        </li>
        <li className="nav-social__item">
          <Link to="/">
            <IconDiscord />
          </Link>
        </li>
        <li className="nav-social__item">
          <Link to="/">
            <IconInstagram />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavSocial;
