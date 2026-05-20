"use client";

import React, { useState } from "react";

interface SearchBoxProps {
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = "Search...",
  value,
  setValue,
}) => {
  const [inputValue, setInputValue] = useState(value || "");

  const handleBtn = () => {
    setValue(inputValue);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={inputValue}
        placeholder={placeholder}
        onChange={(e) => setInputValue(e.target.value)} // 👈 local state
        className="flex-1 px-3 py-1 border rounded-lg focus:outline-none"
      />

      <button
        onClick={handleBtn} // 👈 parent set এখানে
        className="bg-blue-500 text-white px-4 py-2 rounded-lg border border-black cursor-pointer"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBox;
