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
import "react-toastify/dist/ReactToastify.css"; // Don't forget this line!


function Home() {
  const [problems, setProblems] = useState([]);
  const [problemId, setProblemId] = useState('');
  const [problemDetails, setProblemDetails] = useState(null);
  const [userQuery, setUserQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sqlError, setSqlError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [solvedProblems, setSolvedProblems] = useState([]);

  const isMobile = useScreenSize();

  useEffect(() => {
    apiClient
      .get('/api/userinfo')
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user info:', error);
        setError('Failed to load user information. Please try again.');
      });
  }, []);

  useEffect(() => {
    apiClient
      .get('/api/problems')
      .then((response) => {
        setProblems(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching problems:', error);
        setError('Failed to load problems. Please try again.');
      });
  }, []);

  useEffect(() => {
    if (problemId) {
      setProblemDetails(null);
      setError(null);
      setUserQuery('');
      setQueryResult(null);
      setSqlError(null);
      setLoading(false);
      apiClient
        .get(`/api/problems/${problemId}`)
        .then((response) => setProblemDetails(response.data))
        .catch((error) => {
          console.error('Error fetching problem details:', error);
          setError('Error fetching problem details. Please try again.');
        });
    }
  }, [problemId]);

  useEffect(() => {
    if (problemId) {
      setProblemDetails(null);
      setError(null);
      setUserQuery('');
      setQueryResult(null);
      setSqlError(null);
      setLoading(false);

      // Fetch and update the list of solved problems
      apiClient
        .get('/api/submissions')
        .then((response) => {
          const solvedIds = response.data.map(
            (submission) => submission.problem_id
          );
          setSolvedProblems(solvedIds);
        })
        .catch((error) => {
          console.error('Error fetching solved problems:', error);
        });
    }
  }, [problemId]);

  const handleEvaluate = () => {
    if (!problemId) {
      setError('Please select a Question');
      return;
    }
    if (!userQuery) {
      setError('Please provide a query');
      return;
    }

    setLoading(true);
    setError(null);
    setSqlError(null);
    setQueryResult(null);

    apiClient
      .post(`/api/problems/${problemId}/evaluate`, {
        userQuery,
      })
      .then((response) => {
        setQueryResult(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error evaluating query:', error);
        if (error.response?.data?.details) {
          setSqlError(error.response.data.details);
        } else {
          setError('Failed to evaluate the query. Please try again.');
        }
        setLoading(false);
      });
  };

  if (isMobile) {
    return <MobileWarning />;
  }

  const currentTime = new Date().getTime();
  if (currentTime > endTime) {
    return <Navigate to='/countdown' replace />;
  }

  return (
    <div className='flex flex-col h-screen'>
      <Header userInfo={userInfo} />
      <div className='flex flex-1 bg-neutral-950'>
        <Sidebar
          problems={problems}
          problemId={problemId}
          setProblemId={setProblemId}
          problemDetails={problemDetails}
          solvedProblems={solvedProblems}
          className='w-full md:w-1/3 min-h-0 overflow-y-auto'
        />
        <main className='flex-1 p-6 overflow-y-auto min-h-0'>
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
