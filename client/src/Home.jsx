import { useState, useEffect } from 'react';
import apiClient from './apiClient';
import { useScreenSize } from './hooks/useScreenSize';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import QueryEditor from './components/QueryEditor';
import QueryResult from './components/QueryResult';
import ErrorDisplay from './components/ErrorDisplay';
import MobileWarning from './components/MobileWarning';
import { endTime } from './config/date';
import { Navigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  // New state for rules agreement and contest start
  const [agreed, setAgreed] = useState(false);
  const [showContest, setShowContest] = useState(false);

  // ...existing code...
  const [problems, setProblems] = useState([]);
  const [problemId, setProblemId] = useState('');
  const [problemDetails, setProblemDetails] = useState(null);
  const [userQuery, setUserQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sqlError, setSqlError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [solvedProblems, setSolvedProblems] = useState(() => {
    const savedSolvedProblems = localStorage.getItem('solvedProblems');
    return savedSolvedProblems ? JSON.parse(savedSolvedProblems) : [];
  });

  const [currentTime, setCurrentTime] = useState(() => new Date().getTime());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isMobile = useScreenSize();

  // ...existing wrapper and helper functions...

  // ...existing useEffect for fetching data...

  // ...existing useEffect for fetching problem details...

  // ...existing handleEvaluate...

  if (isMobile) {
    return <MobileWarning />;
  }

  const remainingTime = Math.max(0, endTime - currentTime);
  if (currentTime > endTime) {
    return <Navigate to='/countdown' replace />;
  }

  // Show rules/welcome UI until user agrees and clicks Start Contest
  if (!showContest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-3xl font-bold text-blue-400">Bit by Query - SQL Competition Platform</h1>
            <button
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
              onClick={() => window.location.href = "/register"}
            >
              Start Registration
            </button>
          </div>

          {/* Welcome */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-blue-300 mb-6">Welcome to Bit by Query</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              A full-stack SQL competition platform where participants can test their SQL knowledge, compete
              with peers, and rise up the leaderboard.
            </p>
          </div>

          {/* Rules */}
          <div className="bg-gray-800 rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-blue-300 mb-6">Competition Rules & Highlights</h3>
            <ul className="space-y-4">
              <li>Each user must register before joining the contest.</li>
              <li>Contest includes SQL query challenges of varying difficulty.</li>
              <li>Leaderboard is updated in real-time based on scores.</li>
              <li>Ensure to read all instructions before starting.</li>
              <li>Any malpractice leads to disqualification.</li>
              <li>Contest duration: <span className="text-blue-400 font-semibold">2 hours</span></li>
            </ul>

            <div className="mt-8 flex items-center space-x-3">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5"
              />
              <label htmlFor="agree" className="text-gray-300">
                I have read and agree to all the rules & instructions
              </label>
            </div>


            <button
              disabled={!agreed}
              onClick={() => setShowContest(true)}
              className={`w-full py-3 rounded-md shadow-lg ${
                agreed
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Start Contest
            </button>

          </div>
        </div>
      </div>
    );
  }

  // ...existing contest interface...
  return (
    <div className='flex flex-col h-screen'>
      <Header userInfo={userInfo} />
      <div className='flex flex-1 bg-neutral-950'>
        <Sidebar
          problems={problems}
          problemId={problemId}
          setProblemId={handleSetProblemId}
          problemDetails={problemDetails}
          solvedProblems={solvedProblems}
          remainingTime={remainingTime}
          className='w-full md:w-1/3 min-h-0 overflow-y-auto'
        />
        <main className='flex-1 p-6 overflow-y-auto min-h-0'>
          <QueryEditor
            problems={problems}
            problemId={problemId}
            setProblemId={handleSetProblemId}
            userQuery={userQuery}
            setUserQuery={handleSetUserQuery}
            handleEvaluate={handleEvaluate}
            loading={loading}
          />
          <ErrorDisplay error={error} sqlError={sqlError} />
          <QueryResult queryResult={queryResult} />
        </main>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover={true}
        draggable
        pauseOnFocusLoss
      />
    </div>
  );
}

export default Home;