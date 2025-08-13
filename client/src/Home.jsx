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
  const [solvedProblems, setSolvedProblems] = useState(() => {
    const savedSolvedProblems = localStorage.getItem('solvedProblems');
    return savedSolvedProblems ? JSON.parse(savedSolvedProblems) : [];
  });

  const isMobile = useScreenSize();

  // Wrapper function to save problemId to localStorage when it changes
  const handleSetProblemId = (newProblemId) => {
    const normalizedId = newProblemId ? String(newProblemId) : '';
    setProblemId(normalizedId);
    if (normalizedId) {
      localStorage.setItem('selectedProblemId', normalizedId);
    } else {
      localStorage.removeItem('selectedProblemId');
    }
  };

  // Wrapper function to save userQuery to localStorage when it changes
  const handleSetUserQuery = (newQuery) => {
    setUserQuery(newQuery);
    if (problemId) {
      localStorage.setItem(`userQuery_${problemId}`, newQuery);
    }
  };

  // Helper function to extract and normalize solved problem IDs
  const extractSolvedIds = (submissions) => {
    return submissions.map(submission => {
      const id = submission.problem_id;
      return typeof id === 'string' ? parseInt(id, 10) : Number(id);
    }).filter(id => !isNaN(id));
  };

  // Wrapper function to save solved problems to localStorage when they change
  const handleSetSolvedProblems = (newSolvedProblems) => {
    setSolvedProblems(newSolvedProblems);
    localStorage.setItem('solvedProblems', JSON.stringify(newSolvedProblems));
  };

  useEffect(() => {
    apiClient
      .get('/api/userinfo')
      .then((response) => {
        setUserInfo(response.data);
        
        return Promise.all([
          apiClient.get('/api/problems'),
          apiClient.get('/api/submissions')
        ]);
      })
      .then(([problemsResponse, submissionsResponse]) => {
        setProblems(problemsResponse.data);
        
        const solvedIds = extractSolvedIds(submissionsResponse.data);
        handleSetSolvedProblems(solvedIds);
        
        const savedProblemId = localStorage.getItem('selectedProblemId');
        if (savedProblemId && problemsResponse.data.some(p => Number(p.id) === Number(savedProblemId))) {
          setProblemId(String(savedProblemId));
        }
        
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching initial data:', error);
        
        const cachedSolvedProblems = localStorage.getItem('solvedProblems');
        if (cachedSolvedProblems) {
          try {
            const parsedSolvedProblems = JSON.parse(cachedSolvedProblems);
            handleSetSolvedProblems(parsedSolvedProblems);
          } catch (parseError) {
            console.error('Error parsing cached solved problems:', parseError);
          }
        }
        
        const savedProblemId = localStorage.getItem('selectedProblemId');
        if (savedProblemId) {
          setProblemId(String(savedProblemId));
        }
        
        if (error.config?.url?.includes('/userinfo')) {
          setError('Failed to load user information. Please try again.');
        } else if (error.config?.url?.includes('/problems')) {
          setError('Failed to load problems. Please try again.');
        } else {
          setError('Failed to load data. Please try again.');
        }
      });
  }, []);

  useEffect(() => {
    if (problemId) {
      setProblemDetails(null);
      setError(null);
      
      const savedQuery = localStorage.getItem(`userQuery_${problemId}`) || '';
      setUserQuery(savedQuery);
      
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
        
        if (response.data.correct) {
          apiClient
            .get('/api/submissions')
            .then((submissionsResponse) => {
              const solvedIds = extractSolvedIds(submissionsResponse.data);
              handleSetSolvedProblems(solvedIds);
            })
            .catch((error) => {
              console.error('Error refreshing solved problems:', error);
            });
        }
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

  // Reset handler for the Reset button
  const handleReset = () => {
    setUserQuery("");
    setQueryResult(null);
    setError(null);
    setSqlError(null);
    setLoading(false);
    if (problemId) {
      localStorage.setItem(`userQuery_${problemId}`, "");
    }
  };

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
          className='w-full md:w-1/3 min-h-0 overflow-y-auto'
        />
        <main className='flex-1 p-6 overflow-y-auto min-h-0'>
          <QueryEditor
            userQuery={userQuery}
            setUserQuery={handleSetUserQuery}
            handleEvaluate={handleEvaluate}
            loading={loading}
            handleReset={handleReset}
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
