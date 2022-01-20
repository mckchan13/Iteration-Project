import React from "react";
import Search from "./Search";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="flex justify-between items-center px-11 py-4 bg-primary text-white">
      <h1 className="text-2xl font-bold">fithaus</h1>
      <Search />
      <ul className="flex ">
        <li className="pr-3 hover:text-blue100">
          <Link to="/about">About</Link>
        </li>
        <li className="pr-3 hover:text-blue100">
          <Link to="/chat">Chat</Link>
        </li>
        <li className="hover:text-blue100">
          <Link to="/">Signout</Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;
