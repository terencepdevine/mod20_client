import { Link } from "react-router-dom";

import IconYoutube from "../IconYoutube/IconYoutube";
import IconTwitch from "../IconTwitch/IconTwitch";
import IconDiscord from "../IconDiscord/IconDiscord";
import IconInstagram from "../IconInstagram/IconInstagram";

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
