import { useState, useEffect } from "react";
import apiClient from "./apiClient"; // Import the configured Axios instance
import Editor from "@monaco-editor/react";
import { ClipLoader } from "react-spinners";
import { MdDesktopMac } from "react-icons/md";
import { useNavigate } from "react-router-dom"; // For page redirection

function Home() {
  const [problems, setProblems] = useState([]);
  const [problemId, setProblemId] = useState("");
  const [problemDetails, setProblemDetails] = useState(null);
  const [userQuery, setUserQuery] = useState("");
  const [queryResult, setQueryResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sqlError, setSqlError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // New state for user information
  const [startTime, setStartTime] = useState(null); // Start time of the current problem
  const [elapsedTime, setElapsedTime] = useState(0); // Elapsed time as float

  const navigate = useNavigate(); // To redirect after logout

function formatTime(ms) {
  if (isNaN(ms) || ms < 0) return "00:00"; // Return default time if ms is invalid or negative

  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}


  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // mobile breakpoint
    };

    window.addEventListener("resize", checkScreenSize);
    checkScreenSize(); // Initial check

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Fetch user info on component mount
  useEffect(() => {
    apiClient
      .get("/api/userinfo")
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
        setError("Failed to load user information. Please try again.");
      });
  }, []);

  // Fetch problems list on component mount
  useEffect(() => {
    apiClient
      .get("/api/problems")
      .then((response) => {
        setProblems(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching problems:", error);
        setError("Failed to load problems. Please try again.");
      });
  }, []);

  // Fetch problem details when a problem is selected
  useEffect(() => {
    if (problemId) {
      setProblemDetails(null);
      setError(null);
      apiClient
        .get(`/api/problems/${problemId}`)
        .then((response) => setProblemDetails(response.data))
        .catch((error) => {
          console.error("Error fetching problem details:", error);
          setError("Error fetching problem details. Please try again.");
        });
    }
  }, [problemId]);

  // Timer Logic
  useEffect(() => {
    let timerInterval;

    if (startTime) {
      timerInterval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now - startTime) / 1000); // Get duration in seconds
        setElapsedTime(duration * 1000); // Store the elapsed time in milliseconds
      }, 1000);
    }

    return () => clearInterval(timerInterval); // Cleanup interval on unmount
  }, [startTime]);

  // Reset timer when a new problem is selected
  useEffect(() => {
    if (problemId) {
      setStartTime(new Date()); // Set start time to the current time
      setElapsedTime("00:00:00"); // Reset elapsed time display
    }
  }, [problemId]);

  const handleEvaluate = () => {
    if (!problemId || !userQuery.trim()) {
      alert("Please provide both problem ID and query.");
      return;
    }

    setLoading(true);
    setError(null);
    setSqlError(null);
    setQueryResult(null);

    apiClient
      .post(`/api/problems/${problemId}/evaluate`, {
        userQuery,
        elapsedTime,
      })
      .then((response) => {
        setQueryResult(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error evaluating query:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.details
        ) {
          setSqlError(error.response.data.details);
        } else {
          setError("Failed to evaluate the query. Please try again.");
        }
        setLoading(false);
      });
  };

  // Logout function to clear authToken and navigate to login page
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear authToken from localStorage
    navigate("/login"); // Redirect to login page (modify based on your route)
  };

  const renderTable = (data, isCorrect) => {
    if (!data || !Array.isArray(data) || data.length === 0)
      return <p className="text-gray-500">No data available.</p>;

    const headers = Object.keys(data[0]);

    return (
      <table className="min-w-full bg-gray-800 border border-gray-700 rounded-md shadow-md">
        <thead>
          <tr className={isCorrect ? "bg-green-500" : "bg-red-600"}>
            {headers.map((header) => (
              <th
                key={header}
                className="py-2 px-4 text-left text-sm font-medium text-white border-b border-gray-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td
                  key={header}
                  className="py-2 px-4 text-sm text-gray-300 border-b border-gray-700"
                >
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="bg-gray-800 w-full h-screen text-white">
      {/* Message for smaller screens */}
      {isMobile && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
          <MdDesktopMac className="text-7xl mb-4" />
          <p className="text-2xl text-center font-bold">
            This page is only visible on desktop, not on mobile screens.
          </p>
        </div>
      )}

      {/* Main content for larger screens */}
      {!isMobile && (
        <>
          {/* Header */}
          <header className="w-full p-6 bg-gray-800 text-center border-b border-gray-700 relative">
            {/* Display user name and ACM ID in the top-left corner */}
            {userInfo && (
              <div className="absolute top-2 left-6 text-sm font-medium text-gray-200">
                <div className="text-lg font-semibold text-green-400">
                  {userInfo.name}
                </div>
                <div className="text-xs">{`ACM ID: ${userInfo.username}`}</div>
                {problemId && (
                  <div className="mt-1 text-sm">
                    Time Spent:{" "}
                    <span className="text-green-300">{formatTime(elapsedTime)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Main Title */}
            <div className="flex justify-center items-center space-x-4">
              <h1 className="text-3xl font-extrabold text-green-400">
                Bit By Query
              </h1>
            </div>

            {/* Logout Button */}
            <div className="absolute top-6 right-6">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center space-x-2"
              >
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          </header>
          <div className="flex h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <aside className="w-full md:w-1/3 p-6 border-r border-gray-700">
              <h1 className="text-3xl font-bold text-green-400 mb-6">
                Questions
              </h1>

              {problems.length === 0 ? (
                <p className="text-gray-300">
                  No problems available. Try again later.
                </p>
              ) : (
                <div>
                  <label
                    htmlFor="problem"
                    className="block text-lg font-medium text-gray-200 mb-2"
                  >
                    Select Problem:
                  </label>
                  <select
                    id="problem"
                    className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    onChange={(e) => setProblemId(e.target.value)}
                    value={problemId}
                  >
                    <option value="">Select Problem</option>
                    {problems.map((problem) => (
                      <option key={problem.id} value={problem.id}>
                        {problem.title}
                      </option>
                    ))}
                  </select>

                  {problemDetails && (
                    <div className="mt-6">
                      <h2 className="text-2xl font-semibold text-green-400 mb-4">
                        {problemDetails.title}
                      </h2>
                      <p className="text-gray-300">
                        {problemDetails.description}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </aside>

            {/* Main Content */}
            <main className="w-full md:w-2/3 p-6">
              <h2 className="text-3xl font-bold text-green-400 mb-6">
                SQL Editor
              </h2>

              <Editor
                height="300px"
                language="sql"
                value={userQuery}
                onChange={(value) => setUserQuery(value)}
                options={{
                  minimap: { enabled: false },
                  fontSize: 22,
                  theme: "vs-dark",
                }}
                className="border border-gray-700 rounded-md shadow-md m-4"
              />

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleEvaluate}
                  disabled={loading}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <ClipLoader
                        color="#fff"
                        loading={loading}
                        size={20}
                        className="mr-2"
                      />
                      Evaluating...
                    </div>
                  ) : (
                    "Evaluate"
                  )}
                </button>
              </div>

              {error && (
                <div className="bg-red-600 text-white p-4 rounded-md my-6">
                  {error}
                </div>
              )}

              {sqlError && (
                <div className="bg-red-500 text-white p-4 rounded-md my-6">
                  <strong>{sqlError}</strong>
                </div>
              )}

              {queryResult && (
                <div className="mt-8">
                  <h3 className="text-2xl font-semibold text-green-400 mb-4">
                    Evaluation Result
                  </h3>
                  <p className="text-lg text-gray-300 mb-4">
                    Correct:{" "}
                    <span
                      className={
                        queryResult.correct ? "text-green-400" : "text-red-500"
                      }
                    >
                      {queryResult.correct ? "Yes" : "No"}
                    </span>
                  </p>

                  {/* Flexbox for results */}
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* User Output */}
                    <div className="flex-1">
                      <h4 className="text-xl font-medium text-green-300 mb-2">
                        User Output:
                      </h4>
                      {renderTable(queryResult.userOutput, queryResult.correct)}
                    </div>

                    {/* Expected Output */}
                    <div className="flex-1">
                      <h4 className="text-xl font-medium text-green-300 mb-2">
                        Expected Output:
                      </h4>
                      {renderTable(queryResult.expectedOutput, true)}
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
