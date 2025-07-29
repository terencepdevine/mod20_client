import {
  ArrowDownOnSquareIcon,
  FolderArrowDownIcon,
} from "@heroicons/react/20/solid";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Pill from "./Pill/Pill";

type DropdownListProps = {
  text?: string;
};

const DropdownList: React.FC<DropdownListProps> = ({ text = "Download" }) => {
  const [active, setActive] = useState(false);

  const characters = [
    { name: "War Dominion Meditech" },
    { name: "Peace Dominion Meditech" },
    { name: "Craftsman Dominion Meditech" },
  ];

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg bg-gray-900 px-4 py-2 font-bold shadow-xs">
      <div
        className="flex w-full cursor-pointer justify-between gap-4 hover:text-sky-400"
        onClick={() => setActive((active) => !active)}
      >
        <div className="flex items-center gap-4">
          <FolderArrowDownIcon className="h-6 w-6 fill-sky-500" />
          <span
            className={`flex items-center gap-2 ${active && "text-sky-500"}`}
          >
            {text}
            <Pill>PDF</Pill>
          </span>
        </div>
        <ChevronRightIcon
          className={`h-6 w-6 fill-sky-500 transition-all ${active && "rotate-90"}`}
        />
      </div>
      <DropdownListItems characters={characters} active={active} />
    </div>
  );
};

type Character = {
  name: string;
};

type DropdownListItemsProps = {
  active: boolean;
  characters: Character[];
};

const DropdownListItems: React.FC<DropdownListItemsProps> = ({
  active,
  characters,
}) => {
  return (
    <div className={`flex w-full flex-col gap-2 py-2 ${!active && "hidden"}`}>
      {characters.map((character, i) => (
        <Link
          to="/"
          className="flex items-center gap-4 hover:text-sky-400"
          key={i}
        >
          <div className="flex h-6 w-6 items-center justify-center">
            <ArrowDownOnSquareIcon className={`h-5 w-5 fill-sky-500`} />
          </div>
          <span className="flex-1">{character.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default DropdownList;
