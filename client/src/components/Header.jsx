import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const Header = ({ userInfo, problemId, elapsedTime, formatTime }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <header className="w-full p-6 bg-gray-800 text-center border-b border-gray-700 relative">
      {userInfo && (
        <div className="absolute top-2 left-6 text-sm font-medium text-gray-200">
          <div className="text-lg font-semibold text-green-400">
            {userInfo.name}
          </div>
          <div className="text-xs">{`ACM ID: ${userInfo.username}`}</div>
          {problemId && (
            <div className="mt-1 text-sm">
              Time Spent:{" "}
              <span className="text-green-300">
                {formatTime(elapsedTime)}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center items-center space-x-4">
        <h1 className="text-3xl font-extrabold text-green-400">
          Bit By Query
        </h1>
      </div>

      <div className="absolute top-6 right-6">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center space-x-2"
        >
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </header>
  );
};

Header.propTypes = {
  userInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }),
  problemId: PropTypes.string,
  elapsedTime: PropTypes.number,
  formatTime: PropTypes.func.isRequired,
};

export default Header;