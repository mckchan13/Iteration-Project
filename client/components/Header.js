import React from "react";
import Search from "./Search";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { Link } from "react-router-dom";

const Header = () => {

  const history = useNavigate();

  const logout = (e) => {
    // e.preventDefault();
    sessionStorage.clear();
    axios({
      method: 'post',
      url: '/api/auth/logout',
      withCredentials: true,
    }).then((response) => {
      sessionStorage.clear();
      history("/");
      })
      .catch((error) => {
        console.log(error);
      });
    
  }

  return (
    <div className="flex justify-between items-center px-11 py-4 bg-primary text-white">
      <h1 className="text-2xl font-bold">
        <Link to="/dashboard">fithaus</Link>
      </h1>
      <button
          onClick={(e) => logout()}
          className="bg-primary content-center text-white font-medium py-1 px-4 border  rounded-lg tracking-wide mr-1 hover:bg-gray-100 first-letter  "
        >
          Logout
        </button>
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
