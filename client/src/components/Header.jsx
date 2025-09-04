import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import { toast } from "react-toastify";
import { logout } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import apiClient from "../apiClient";

const Header = ({ userInfo }) => {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dispatch = useDispatch();

  const confirmLogout = async() => {
    const res=await apiClient.post("/api/logout",{},{
      withCredentials:true
    });
    if(res.status == 201){
      dispatch(logout());
    }
    toast.success("Logging Out!");
    setShowLogoutModal(false);
    setTimeout(() => {
      navigate("/login");
    }, 3500);
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
          onClick={() => setShowInstructions(true)}
        >
          <span className="font-semibold">Instructions</span>
        </button>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center space-x-2"
        >
          <span className="font-semibold">Logout</span>
        </button>
      </div>

      <Modal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
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
