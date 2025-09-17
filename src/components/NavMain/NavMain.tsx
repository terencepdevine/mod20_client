import { Link } from "react-router-dom";

import "./NavMain.scss";

const NavMain: React.FC = () => {
  return (
    <nav className="nav-main">
      <ul className="nav-main__list">
        <li className="nav-main__item">
          <Link to="/systems">Systems</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavMain;