import SidebarNavigation from "./SidebarNavigation";

import { FolderArrowDownIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import Pill from "./Pill";
import DropdownSystem from "./DropdownSystem";

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden w-full flex-col bg-gray-300 lg:flex lg:w-1/4 xl:w-1/5 dark:bg-gray-925">
      <DropdownSystem />
      <div className="relative flex-1 overflow-y-scroll px-2">
        <SidebarNavigation />
      </div>
      <div className="px-2 py-2">
        <Link
          to="/"
          className="flex items-center gap-4 rounded-lg bg-gray-900 px-4 py-2 font-bold hover:bg-gray-850"
        >
          <div className="flex flex-1 items-center gap-4">
            <FolderArrowDownIcon className="h-6 w-6 fill-sky-500" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-300">Secondary Text</span>
              <span className="text-gray-100">System Downloads</span>
            </div>
          </div>
          <Pill>PDF</Pill>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
