import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { startTime, endTime } from "./config/date";
import { useSelector } from "react-redux";

function Middleware({ children }) {
  
  const location = useLocation();

  const currentTime = new Date().getTime();
  const isLoggedIn = useSelector((state)=>state.auth.isLoggedIn);

  const publicRoutes = ["/", "/leaderboard", "/countdown"];
  const authRoutes = ["/login", "/register"];

  if (!isLoggedIn && !publicRoutes.includes(location.pathname)) {
    if (!authRoutes.includes(location.pathname)) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  if (isLoggedIn && authRoutes.includes(location.pathname)) {
    return <Navigate to="/home" replace />;
  }

  if (location.pathname === "/home" || location.pathname === "/") {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    if (currentTime < startTime || currentTime > endTime) {
      return <Navigate to="/countdown" replace />;
    }
  }

  if (publicRoutes.includes(location.pathname)) {
    return children;
  }

  return children;
}

Middleware.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Middleware;
