import { Navigate, useLocation } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function Middleware({ children }) {
  const token = localStorage.getItem("authToken");
  const location = useLocation();

  if (location.pathname === "/") {
    if (token) {
      // If the user is logged in, redirect to /home
      return <Navigate to="/home" replace />;
    } else {
      // If the user is not logged in, redirect to /login
      return <Navigate to="/login" replace />;
    }
  }

  if (location.pathname === "/home" && !token) {
    // If the user is not logged in and tries to access /home, redirect to /login
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default Middleware;
