import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate()
  const handleEnter = async (e) => {
    if (e.keyCode === 13) {
      console.log(search);
      try {
        const result = await axios.post(`/api/search?search=${search}`);

        console.log(result.data);

        navigate("../results", { state: result.data });
      } catch (error) {
        console.log('api', error)
      }
      
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
