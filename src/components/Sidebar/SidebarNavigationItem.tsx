import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface SidebarNavigationItemProps {
  systemSlug: string;
  item: {
    name: string;
    slug: string;
    children?: {
      name: string;
      slug: string;
    }[];
  };
}

const SidebarNavigationItem = ({
  systemSlug,
  item,
}: SidebarNavigationItemProps) => {
  const [active, setActive] = useState<boolean>(false);
  const { sectionSlug } = useParams();

  const handleClick = () => {
    setActive((s) => !s);
  };

  return (
    <li
      className={`nav-sidebar__item ${active ? "nav-sidebar__item--active" : ""}`}
    >
      <button className="nav-sidebar__link" onClick={handleClick}>
        {item.name}
        <ChevronDownIcon className="nav-sidebar__link-arrow" />
      </button>

      <AnimatePresence initial={false}>
        {item.children && active && (
          <motion.ul
            className="nav-sidebar__sub-list"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.12, ease: "easeInOut" }}
          >
            {item.children.map((child) => (
              <li
                key={child.slug}
                className={`nav-sidebar__sub-item ${sectionSlug === child.slug ? "nav-sidebar__sub-item--active" : ""}`}
              >
                <Link
                  to={`/systems/${systemSlug}/${item.slug}/${child.slug}`}
                  className={`nav-sidebar__sub-link`}
                >
                  {child.name}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
};

export default SidebarNavigationItem;
