import { useState, useEffect } from "react";
import axios from "axios";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa"; // Import icons for loading and error

function LeaderBoard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(null); // State to hold last refreshed time

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "https://bit-by-query-server.vercel.app/api/leaderboard"
        );

        // Log response for debugging
        console.log("Leaderboard Data:", response.data);

        if (Array.isArray(response.data)) {
          setLeaderboard(response.data);
          setLastRefreshed(new Date()); // Update last refreshed time when leaderboard is fetched
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        const message =
          err.response?.data?.error || "Failed to fetch leaderboard.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchLeaderboard();

    // Set up interval to refresh leaderboard every 30 seconds
    const intervalId = setInterval(fetchLeaderboard, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  function formatTime(ms) {
    if (isNaN(ms) || ms < 0) return "00:00"; // Return default time if ms is invalid or negative

    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function formatDate(date) {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };
    return new Date(date).toLocaleString(undefined, options);
  }

  return (
    <div className="w-full h-screen bg-gray-800 text-white flex items-center justify-center">
      <div className="w-full md:w-2/3 lg:w-1/2 bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-green-400 mb-4 text-center">
          Leaderboard
        </h2>

        {loading ? (
          <div className="flex justify-center items-center">
            <FaSpinner className="animate-spin text-4xl text-green-400" />
            <p className="ml-4 text-white">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center text-red-500">
            <FaExclamationTriangle className="mr-2" />
            <p>{error}</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <p className="text-center text-gray-400">No data available.</p>
        ) : (
          <>
            <div className="text-sm text-gray-400 text-center mb-4">
              Last Refreshed:{" "}
              {lastRefreshed ? formatDate(lastRefreshed) : "N/A"}
            </div>
            <table className="w-full text-center border-collapse border border-gray-700 mt-4">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-700 p-3 text-lg">Rank</th>
                  <th className="border border-gray-700 p-3 text-lg">
                    Username
                  </th>
                  <th className="border border-gray-700 p-3 text-lg">Name</th>
                  <th className="border border-gray-700 p-3 text-lg">
                    Problems Solved
                  </th>
                  <th className="border border-gray-700 p-3 text-lg">
                    Total Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((player, index) => (
                  <tr
                    key={player.username}
                    className={`${
                      index % 2 === 0
                        ? "bg-gray-800"
                        : "bg-gray-700 hover:bg-gray-600"
                    } transition duration-300 ease-in-out`}
                  >
                    <td className="border border-gray-700 p-3 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-700 p-3">
                      {player.username}
                    </td>
                    <td className="border border-gray-700 p-3">
                      {player.name}
                    </td>
                    <td className="border border-gray-700 p-3 text-center">
                      {player.problems_solved}
                    </td>
                    <td className="border border-gray-700 p-3 text-center">
                      {formatTime(player.total_time)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

export default LeaderBoard;
