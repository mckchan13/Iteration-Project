import React from "react";
import Search from "./Search";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="flex justify-between items-center px-11 py-4 bg-primary text-white">
      <h1 className="text-2xl font-bold">fithaus</h1>
      <Search />
      <ul className="flex ">
        <li className="pr-2 hover:text-blue100">
          <a href="#">About</a>
        </li>
        <li className="pr-2 hover:text-blue100">
          <a href="#">Chat</a>
        </li>
        <li className="hover:text-blue100">
          <a href="#">Signout</a>
        </li>
      </ul>
    </div>
  );
};

export default Header;
