// src/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

//Todo: change this later
const isAuthenticated = true;

function PrivateRoute({ children }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
