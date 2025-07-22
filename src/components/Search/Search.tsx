import React, { useEffect, useRef, useState } from "react";
import IconSearch from "../icons/IconSearch";
import Pill from "../Pill/Pill";
import PillWrap from "../Pill/PillWrap";

import "./Search.css";

interface SearchProps {
  placeholder?: string;
}

const Search: React.FC<SearchProps> = ({ placeholder = "Search" }) => {
  const [search, setSearch] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event?.target.value);
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
    <div className="search-wrap">
      <div
        className={`search ${isFocused && "search--focus"}`}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="search__primary">
          <IconSearch />
          <input
            type="text"
            ref={inputRef}
            className="search__input"
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <span className="search__hidden-width" ref={spanRef}></span>
          {search === "" && (
            <PillWrap>
              <Pill>Ctrl</Pill>
              <Pill>K</Pill>
            </PillWrap>
          )}
        </div>
        {/* <div className="search__systems">
          <span className="search__systems-active">Cybrutalist 2345</span>
        </div> */}
      </div>
    </div>
  );
};

export default Search;
