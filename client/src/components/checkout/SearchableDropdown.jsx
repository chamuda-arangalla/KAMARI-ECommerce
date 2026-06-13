import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

export default function SearchableDropdown({
  value,
  onChange,
  options,
  placeholder,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const searchRef = useRef(null);

  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.toLowerCase().includes(search.toLowerCase()),
      ),
    [options, search],
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;

    const timeoutId = setTimeout(() => searchRef.current?.focus(), 50);
    return () => clearTimeout(timeoutId);
  }, [open]);

  const toggleOpen = () => {
    if (!open) setSearch("");
    setOpen((current) => !current);
  };

  const selectOption = (option) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className="district-dropdown" ref={ref}>
      <button
        type="button"
        className={`district-trigger ${!value ? "placeholder" : ""}`}
        onClick={toggleOpen}
      >
        <span>{value || placeholder}</span>
        <ChevronDown
          size={14}
          className={`district-chevron ${open ? "open" : ""}`}
        />
      </button>

      {open && (
        <div className="district-menu">
          <div className="district-search-wrap">
            <Search size={14} className="district-search-icon" />
            <input
              ref={searchRef}
              type="text"
              className="district-search"
              placeholder={`Search ${placeholder.toLowerCase()}...`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <ul className="district-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option}
                  className={`district-option ${
                    value === option ? "selected" : ""
                  }`}
                  onMouseDown={() => selectOption(option)}
                >
                  {option}
                </li>
              ))
            ) : (
              <li className="district-no-result">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
