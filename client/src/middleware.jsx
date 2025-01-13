import { Navigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';

function Middleware({ children }) {
  const token = localStorage.getItem("authToken");
  const location = useLocation();

  if (location.pathname === "/") {
    if (token) {
      return <Navigate to="/home" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  if (location.pathname === "/home" && !token) {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname === "/register" && token) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
Middleware.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Middleware;
