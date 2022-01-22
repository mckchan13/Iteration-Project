import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
export default function Header() {
  const history = useNavigate();

  const displayDesktop = () => {
    return (
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          fit haús
        </Typography>
      </Toolbar>
    );
  };
  const logout = (e) => {
    // e.preventDefault();
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
    <header>
      <AppBar position="static">{displayDesktop()}</AppBar>
      <button
          onClick={(e) => logout()}
          className="bg-primary content-center text-white font-medium py-1 px-4 border  rounded-lg tracking-wide mr-1 hover:bg-gray-100 first-letter  "
        >
          Logout
        </button>
    </header>
  );
}
