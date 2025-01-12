import { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners"; // Importing ClipLoader spinner

function App() {
  const [problems, setProblems] = useState([]);
  const [queryResult, setQueryResult] = useState(null);
  const [problemId, setProblemId] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch problems on component mount
  useEffect(() => {
    axios
      .get("/api/problems")
      .then((response) => setProblems(response.data))
      .catch((error) => {
        console.error("Error fetching problems:", error);
        setError("Error fetching problems");
      });
  }, []);

  const handleEvaluate = () => {
    if (!problemId || !userQuery) {
      alert("Please provide both problem ID and query");
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .post("/api/evaluate", { problemId, userQuery })
      .then((response) => {
        setQueryResult(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error evaluating query:", error);
        setLoading(false);
        setError("Error evaluating the query. Please try again.");
      });
  };

  const renderTable = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    // Get table headers from the keys of the first object
    const headers = Object.keys(data[0]);

    return (
      <table className="min-w-full bg-gray-50 border border-gray-200 rounded-md shadow-md">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="py-2 px-4 text-left text-sm font-medium text-gray-600 border-b"
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
                  className="py-2 px-4 text-sm text-gray-700 border-b"
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
    <div className="App max-w-3xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg border border-gray-200">
      <h1 className="text-4xl font-semibold text-center text-indigo-700 mb-8">
        Problem Evaluator
      </h1>

      {/* Problem Selection Dropdown */}
      <div className="mb-6">
        <label
          htmlFor="problem"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          Choose a problem:
        </label>
        <select
          id="problem"
          className="w-full p-3 mt-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(e) => setProblemId(e.target.value)}
          value={problemId}
        >
          <option value="">Select Problem</option>
          {problems.length > 0 ? (
            problems.map((problem) => (
              <option key={problem.id} value={problem.id}>
                {problem.title}
              </option>
            ))
          ) : (
            <option value="">No problems available</option>
          )}
        </select>
      </div>

      {/* User Query Input */}
      <div className="mb-6">
        <label
          htmlFor="userQuery"
          className="block text-lg font-medium text-gray-700 mb-2"
        >
          User Query:
        </label>
        <textarea
          id="userQuery"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="Enter your SQL query here"
          rows="6"
          className="w-full p-3 mt-2 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Evaluate Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleEvaluate}
          disabled={loading}
          className="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Display Evaluation Results */}
      {queryResult && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Evaluation Result:
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            Correct:{" "}
            <span
              className={
                queryResult.correct ? "text-green-500" : "text-red-500"
              }
            >
              {queryResult.correct ? "Yes" : "No"}
            </span>
          </p>

          <div className="bg-gray-50 p-4 rounded-md shadow-md mb-4">
            <h3 className="text-xl font-medium text-gray-800">User Output:</h3>
            {renderTable(queryResult.userOutput)}
          </div>

          <div className="bg-gray-50 p-4 rounded-md shadow-md mb-4">
            <h3 className="text-xl font-medium text-gray-800">
              Expected Output:
            </h3>
            {renderTable(queryResult.expectedOutput)}
          </div>

          {/* Display Duration */}
          <div className="mt-4">
            <h3 className="text-xl font-medium text-gray-800">
              Evaluation Duration:
            </h3>
            <p className="text-gray-700">{queryResult.duration}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
