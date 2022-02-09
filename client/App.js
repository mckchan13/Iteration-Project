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
} from "react-router-dom";
import Cookies from "js-cookie";
import axios from 'axios';

import LoginSignupPage from "./pages/LoginSignupPage";
import DashBoardContainer from "./pages/DashboardContainer";
import AthletePage from "./pages/AthletePage";
import PostDetailsPage from "./pages/PostDetailsPage";
import ResultsPage from "./pages/ResultsPage";
import ChatPage from "./pages/ChatPage";

//All route should establish at the App level
export default function App() {
  // const [authenticated, setAuthenticated] = useState(false);
  const history = useNavigate();
  const [ currUser, setCurrUser ] = useState(sessionStorage.getItem('userId') ? sessionStorage.getItem('userId') : null);
  const [isAuth, setAuth] = useState(sessionStorage.getItem('userId') ? true : false);
  console.log(sessionStorage.getItem('userId'))
  useEffect(() => {
    // sessionStorage.clear();
    axios({
      method: 'GET',
      url: '/api/auth/checkAuth',
      withCredentials: true,
    }).then((response) => {
      console.log('this is the response', response)
      
      setAuth(response.status === 200 ? true : false);
      })
      .catch((error) => {
        console.log(error);
      });
  });
  
  const RequireAuth = ({ Component, currUser, setAuth }) => {
    if (isAuth) {
      return <Component currUser={currUser} setAuth={setAuth} />;
    } else {
      return (
        <div className="grid place-content-center">
          <h1 className="text-3xl font-extrabold font-sans text-center py-10">
            Please log in to continue
          </h1>
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

  return (
    <div className="App">
      <Routes>
        {/* <Route path="/" 
        element={ isAuth ? history('dashboard') :
          <RequireAuth Component={LoginSignupPage} setAuth={setAuth}/>
        }/>  */}
        <Route path="/" 
        element={
        <LoginSignupPage setAuth={setAuth} setCurrUser={setCurrUser}/>
        }/> 
        <Route
          path="/dashboard"
          element={
            <RequireAuth Component={DashBoardContainer} currUser={currUser}/>
          }
        />

        {/* <Route
          path="/athletepage/:athleteId"
          element={
            <RequireAuth Component={AthletePage}>
            </RequireAuth>
          }
        />

        <Route
          path="/athletepage"
          element={
            <RequireAuth Component={AthletePage}/>
          }
        />   */}

        <Route
          path="workoutPost/:post"
          element={<RequireAuth Component={PostDetailsPage}></RequireAuth>}
        />

        <Route
          path="results"
          element={<RequireAuth Component={ResultsPage}></RequireAuth>}
        />

        <Route
          path="chat"
          element={<RequireAuth Component={ChatPage}></RequireAuth>}
        />
      </Routes>
    </div>
  );
}
