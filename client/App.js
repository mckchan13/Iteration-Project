import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Cookies from "js-cookie";

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

  const RequireAuth = ({ Component, ...rest }) => {
    if (Cookies.get("athleteId")) {
      return <Component {...rest} />;
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
        <Route path="/" element={<LoginSignupPage />} />

        <Route
          path="dashboard"
          element={<RequireAuth Component={DashBoardContainer}></RequireAuth>}
        />

        <Route
          path="athletepage/:athleteId"
          element={<RequireAuth Component={AthletePage}></RequireAuth>}
        />

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
