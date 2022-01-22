import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import Cookies from "js-cookie";
import axios from 'axios';

import LoginSignupPage from './pages/LoginSignupPage';
import DashBoardContainer from "./pages/DashboardContainer";
import AthletePage from "./pages/AthletePage";

//All route should establish at the App level
export default function App() {
  // const [authenticated, setAuthenticated] = useState(false);
  const history = useNavigate();
  const [isAuth, setAuth] = useState(false); 

  useEffect(() => {
    
    axios({
      method: 'get',
      url: '/api/auth/checkAuth',
      withCredentials: true,
    }).then((response) => {
      setAuth(response.status === 200 ? true : false);
      sessionStorage.setItem("userId","xx")
      })
      .catch((error) => {
        console.log(error);
        setAuth(false);
      });
  }, []);
  
  console.log(sessionStorage)
  const RequireAuth = ({ Component, ...rest }) => {
    if (isAuth) {
      return <Component {...rest} />;
    } else {
      return (
        <div className="grid place-content-center">
          <h1 className="text-3xl font-extrabold font-sans text-center py-10">Please log in to continue</h1>
          <button
            onClick={() => {
              console.log("failed to log in");
              return history("");
            }}
            className="text-3xl border-2 border-primary-500"
          >
            Log in
          </button>
        </div>
      );
    }
  };

  console.log(sessionStorage.getItem("userId") )
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={sessionStorage.getItem("userId") ? <Navigate to="/dashboard" /> : <LoginSignupPage setAuth={setAuth}/>}>
        </Route>

        <Route
          path="/dashboard"
          element={
            <RequireAuth Component={DashBoardContainer}>
              {/* <DashBoardContainer /> */}
            </RequireAuth>
          }
        />

        <Route
          path="/athletepage"
          element={
            <RequireAuth Component={AthletePage}>
              {/* <AthletePage /> */}
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}
