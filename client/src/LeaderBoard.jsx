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
        const response = await axios.get("/api/leaderboard");

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
    <div className="w-full min-h-screen bg-gray-800 text-white flex items-center justify-center py-8">
      <div className="w-full md:w-2/3 lg:w-1/2 bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-green-400 mb-6 text-center">
          Leaderboard
        </h2>

        {loading ? (
          <div className="flex justify-center items-center space-x-4">
            <FaSpinner className="animate-spin text-4xl text-green-400" />
            <p className="text-lg text-white">Loading...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center text-red-500 space-x-2">
            <FaExclamationTriangle className="text-2xl" />
            <p className="text-lg">{error}</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <p className="text-center text-gray-400">No data available.</p>
        ) : (
          <>
            <div className="text-sm text-gray-400 text-center mb-4">
              Last Refreshed:{" "}
              {lastRefreshed ? formatDate(lastRefreshed) : "N/A"}
            </div>
            <div className="overflow-y-auto max-h-[700px]">
              <table className="w-full text-center border-collapse border border-gray-700">
                <thead>
                  <tr className="bg-gray-800 sticky top-0 shadow-md z-10">
                    <th className="border border-gray-700 p-4 text-lg text-white">
                      Rank
                    </th>
                    <th className="border border-gray-700 p-4 text-lg text-white">
                      Username
                    </th>
                    <th className="border border-gray-700 p-4 text-lg text-white">
                      Name
                    </th>
                    <th className="border border-gray-700 p-4 text-lg text-white">
                      Problems Solved
                    </th>
                    <th className="border border-gray-700 p-4 text-lg text-white">
                      Score
                    </th>
                    <th className="border border-gray-700 p-4 text-lg text-white">
                      Last Submission
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((player, index) => (
                    <tr
                      key={player.username}
                      className={`${
                        index % 2 === 0 ? "bg-gray-700" : "bg-gray-600"
                      } border-t border-gray-700`}
                    >
                      <td className="border border-gray-700 p-4 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-700 p-4">
                        {player.username}
                      </td>
                      <td className="border border-gray-700 p-4">
                        {player.name}
                      </td>
                      <td className="border border-gray-700 p-4 text-center">
                        {player.problems_solved}
                      </td>
                      <td className="border border-gray-700 p-4 text-center">
                        {player.score}
                      </td>
                      <td className="border border-gray-700 p-4 text-center">
                        {player.last_submission
                          ? formatDate(new Date(player.last_submission * 1000)) // Convert Unix timestamp to Date
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LeaderBoard;
