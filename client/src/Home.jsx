import { useState, useEffect } from "react";
import apiClient from "./apiClient";
import { useScreenSize } from "./hooks/useScreenSize";
import { useTimer } from "./hooks/useTimer";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import QueryEditor from "./components/QueryEditor";
import QueryResult from "./components/QueryResult";
import ErrorDisplay from "./components/ErrorDisplay";
import MobileWarning from "./components/MobileWarning";
import { endTime } from "./config/date";
import { Navigate } from "react-router-dom";

function Home() {
  const [problems, setProblems] = useState([]);
  const [problemId, setProblemId] = useState("");
  const [problemDetails, setProblemDetails] = useState(null);
  const [userQuery, setUserQuery] = useState("");
  const [queryResult, setQueryResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sqlError, setSqlError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [solvedProblems, setSolvedProblems] = useState([]); // New state for solved problems

  const isMobile = useScreenSize();
  const elapsedTime = useTimer(problemId);

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

  useEffect(() => {
    if (problemId) {
      setProblemDetails(null);
      setError(null);
      setUserQuery("");
      setQueryResult(null);
      setSqlError(null);
      setLoading(false);
      apiClient
        .get(`/api/problems/${problemId}`)
        .then((response) => setProblemDetails(response.data))
        .catch((error) => {
          console.error("Error fetching problem details:", error);
          setError("Error fetching problem details. Please try again.");
        });
    }
  }, [problemId]);

useEffect(() => {
  if (problemId) {
    setProblemDetails(null);
    setError(null);
    setUserQuery("");
    setQueryResult(null);
    setSqlError(null);
    setLoading(false);

    // Fetch and update the list of solved problems
    apiClient
      .get("/api/submissions")
      .then((response) => {
        const solvedIds = response.data.map(
          (submission) => submission.problem_id
        );
        setSolvedProblems(solvedIds);
      })
      .catch((error) => {
        console.error("Error fetching solved problems:", error);
      });
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
        if (error.response?.data?.details) {
          setSqlError(error.response.data.details);
        } else {
          setError("Failed to evaluate the query. Please try again.");
        }
        setLoading(false);
      });
  };

  const formatTime = (ms) => {
    if (isNaN(ms) || ms < 0) return "00:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (isMobile) {
    return <MobileWarning />;
  }

  const currentTime = new Date().getTime();
  if (currentTime > endTime) {
    return <Navigate to="/countdown" replace />;
  }

  return (
    <div className="flex flex-col h-screen">
      <Header
        userInfo={userInfo}
        problemId={problemId}
        elapsedTime={elapsedTime}
        formatTime={formatTime}
      />
      <div className="flex flex-1 overflow-hidden bg-gray-900">
        <Sidebar
          problems={problems}
          problemId={problemId}
          setProblemId={setProblemId}
          problemDetails={problemDetails}
          solvedProblems={solvedProblems}
          className="w-full md:w-1/3 min-h-0"
        />
        <main className="flex-1 p-6 overflow-y-auto min-h-0">
          <QueryEditor
            userQuery={userQuery}
            setUserQuery={setUserQuery}
            handleEvaluate={handleEvaluate}
            loading={loading}
          />
          <ErrorDisplay error={error} sqlError={sqlError} />
          <QueryResult queryResult={queryResult} />
        </main>
      </div>
    </div>
  );
}

export default Home;
