import { NavLink } from "react-router-dom";

const Navigation: React.FC = () => {
  const navigationItems = [
    {
      name: "Systems",
      to: "/systems",
    },
  ];

  return (
    <nav>
      <ul className="flex flex-col gap-1 md:flex-row md:gap-6 md:p-0">
        {navigationItems.map((item, i) => {
          return <NavigationItem name={item.name} to={item.to} key={i} />;
        })}
      </ul>
    </nav>
  );
};

type NavigationItemProps = {
  name: string;
  to: string;
};

const NavigationItem: React.FC<NavigationItemProps> = ({ name, to }) => {
  return (
    <li className="block">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `block rounded px-2 py-1 font-bold hover:bg-gray-925 lg:p-0 lg:text-lg lg:hover:bg-transparent ${
            isActive ? "text-sky-500" : "text-gray-300"
          }`
        }
      >
        {name}
      </NavLink>
    </li>
  );
};

export default Navigation;
