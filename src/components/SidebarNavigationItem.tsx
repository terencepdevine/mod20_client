import { useState } from "react";
import { SystemNavigationItemType } from "../types/SystemNavigation";
import { Link, useParams } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

export const SidebarNavigationItem: React.FC<SystemNavigationItemType> = ({
  name,
  slug,
  systemId,
  children,
}) => {
  const [active, setActive] = useState(false);
  const { roleId } = useParams();

  return (
    <li>
      <Link
        to="#"
        className={`group flex justify-between rounded-lg py-2 pl-4 pr-2 font-bold hover:bg-gray-900 ${!active ? "text-gray-100" : "text-sky-500"}`}
        onClick={() => setActive((active) => !active)}
      >
        <span className="block">{name}</span>
        <ChevronRightIcon
          className={`h-6 w-6 transition-all group-hover:fill-sky-500 ${!active ? "fill-gray-100" : "rotate-90 fill-sky-500"}`}
        />
      </Link>
      {active && (
        <ul className="py-4">
          {children.map((child, i) => {
            return (
              <li key={i}>
                <Link
                  to={`/systems/${systemId}/${slug}/${child.id}`}
                  className={`block rounded-lg px-4 py-2 text-sm ${child.id === roleId && "bg-gray-900 font-bold text-sky-500"}`}
                >
                  {child.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
};
