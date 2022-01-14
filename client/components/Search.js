import React, { useState } from "react";

const Search = () => {
  const [search, setSearch] = useState("");

  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      console.log(search);
    }
  };

  return (
    <div>
      <input
        className="p-0.5 rounded placeholder-gray-700 focus:outline-none focus:bg-white text-gray-700"
        type="text"
        placeholder="Search..."
        onKeyDown={(e) => handleEnter(e)}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      ></input>
    </div>
  );
};

export default Search;
