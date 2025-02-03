import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useEffect, useRef, useState } from "react";
import Pill from "./Pill";

interface SearchProps {
  placeholder?: string;
}

const Search: React.FC<SearchProps> = ({ placeholder = "Search" }) => {
  const [search, setSearch] = useState<string>("");
  const [searchList, setSearchList] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      } else if (event.key === "Escape") {
        if (inputRef.current?.value) {
          setSearch("");
        } else {
          inputRef.current?.blur();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (search !== "" && inputRef.current) {
      inputRef.current.style.width = "auto";
    } else if (inputRef.current && spanRef.current) {
      spanRef.current.textContent = placeholder;
      const width = spanRef.current.offsetWidth;
      inputRef.current.style.width = `${width}px`;
    }
  }, [placeholder, search]);

  return (
    <div className="flex-1">
      <div
        className={`relative flex max-w-[560px] flex-1 cursor-text items-center rounded-lg pl-3 pr-2 transition-colors lg:pl-4 ${isFocused ? "bg-gray-850" : "bg-gray-900"} hover:bg-gray-850`}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-1 items-center gap-2">
          <MagnifyingGlassIcon className="h-5 w-5 fill-gray-500 lg:h-6 lg:w-6" />
          <input
            type="text"
            ref={inputRef}
            placeholder={placeholder}
            value={search}
            className={`w-auto flex-1 grow-0 bg-transparent py-2 text-gray-100 placeholder:italic placeholder:text-gray-500 focus:outline-hidden lg:text-lg`}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <span
            ref={spanRef}
            className="invisible absolute whitespace-nowrap px-2 py-1 font-sans"
            style={{ visibility: "hidden" }}
          ></span>
          {search === "" && (
            <div className="hidden gap-1 lg:flex">
              <Pill color="text-gray-500">Ctrl</Pill>
              <Pill color="text-gray-500">K</Pill>
            </div>
          )}
        </div>
        <div className="hidden sm:block">
          <div
            className={`flex cursor-pointer items-center gap-2 rounded-sm px-2 py-0.5 ${searchList && "bg-gray-950"}`}
            onClick={() => setSearchList((searchList) => !searchList)}
          >
            <span className="text-sm italic text-gray-500">All Systems</span>
            <ChevronDownIcon
              className={`h-4 w-4 fill-gray-500 transition-all ${searchList && "rotate-180"}`}
            />
            {/* <ul>
          <li>Fantasy</li>
          <li>Dark Future</li>
          <li>Wild West</li>
        </ul> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
