import { ListBulletIcon } from "@heroicons/react/24/solid";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

const DropdownSystem: React.FC = () => {
  const [active, setActive] = useState(false);
  return (
    <div className="cursor-pointer p-2">
      <div
        className="flex items-center justify-between gap-4 rounded-lg bg-gray-900 px-4 py-2 transition-all hover:bg-gray-850"
        onClick={() => setActive((prev) => !prev)}
      >
        <div className="flex items-center gap-4">
          <ListBulletIcon className="h-6 w-6 fill-sky-500" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-300">Dark Future</span>
            <span className="font-bold text-gray-100">Character</span>
          </div>
        </div>
        <ChevronRightIcon
          className={`h-6 w-6 fill-sky-500 transition-all duration-200 ${active && "rotate-90"}`}
        />
      </div>
    </div>
  );
};

export default DropdownSystem;
