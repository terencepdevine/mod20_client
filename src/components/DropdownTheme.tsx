import {
  ChevronDownIcon,
  ComputerDesktopIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/16/solid";
import { useState } from "react";

const DropdownTheme: React.FC = () => {
  const [active, setActive] = useState(false);
  const themes = [
    {
      name: "System",
      icon: <ComputerDesktopIcon className="h-4 w-4 fill-sky-500" />,
      active: false,
    },
    {
      name: "Dark",
      icon: <MoonIcon className="h-4 w-4 fill-sky-500" />,
      active: true,
    },
    {
      name: "Light",
      icon: <SunIcon className="h-4 w-4 fill-sky-500" />,
      active: false,
    },
  ];

  return (
    <span
      className="flex cursor-pointer flex-col rounded bg-gray-950 px-2 py-2 text-sm text-gray-300"
      onClick={() => setActive((active) => !active)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MoonIcon className="h-4 w-4 fill-sky-500" />
          Dark Mode
        </div>
        <ChevronDownIcon
          className={`h-4 w-4 fill-sky-500 transition-all ${active && "rotate-180"}`}
        />
      </div>
      {active && (
        <ul className="pt-2">
          {themes.map((theme) => {
            return (
              <li className="flex items-center gap-2 py-1">
                {theme.icon}
                <span
                  className={`${theme.active ? "font-bold text-sky-500" : "text-gray-300 hover:text-gray-100"}`}
                >
                  {theme.name}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </span>
  );
};

export default DropdownTheme;
