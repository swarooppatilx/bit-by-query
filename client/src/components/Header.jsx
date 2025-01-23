/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";

const Header = ({ userInfo }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <header className="w-full px-5 py-3 bg-neutral-950 border-b border-gray-700 relative flex justify-between items-center">
      {userInfo && (
        <div className="text-sm text-gray-200">
          <div className="text-lg font-semibold text-green-500">
            {userInfo.name}
          </div>
          <div className="text-xs">{`ACM ID: ${userInfo.username}`}</div>
        </div>
      )}

      <h1 className="text-3xl font-extrabold text-blue-400 text-center">
        Bit By Query
      </h1>

      <div className="flex gap-3 text-sm">
        <button
          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setShowModal(true)}
        >
          <span className="font-semibold">Instructions</span>
        </button>
        <button
          onClick={handleLogout}
          className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center space-x-2"
        >
          <span className="font-semibold">Logout</span>
        </button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} />
    </header>
  );
};

Header.propTypes = {
  userInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }),
};

export default Header;
