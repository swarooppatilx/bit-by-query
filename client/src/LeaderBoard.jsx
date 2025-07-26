import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';


function LeaderBoard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/leaderboard');
        if (Array.isArray(response.data)) {
          setLeaderboard(response.data);
          setLastRefreshed(new Date());
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        const message =
          err.response?.data?.error || 'Failed to fetch leaderboard.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  function formatDate(date) {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    };
    return new Date(date).toLocaleString(undefined, options);
  }

  return (
    <div className='w-full min-h-screen bg-neutral-950 text-white py-20'>
      <div className='w-full md:w-2/3 mx-auto'>
        <h2 className='text-4xl font-bold text-green-500 mb-6 text-center'>
          Leaderboard
        </h2>

        {loading ? (
          <div className='flex justify-center items-center space-x-4'>
            <FaSpinner className='animate-spin text-4xl text-blue-400' />
            <p className='text-lg text-white'>Loading...</p>
          </div>
        ) : error ? (
          <div className='flex justify-center items-center text-red-500 space-x-2'>
            <FaExclamationTriangle className='text-2xl' />
            <p className='text-lg'>{error}</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <p className='text-center text-gray-400'>No data available.</p>
        ) : (
          <>
            <div className='text-sm text-gray-400 text-center mb-4'>
              Last Refreshed: {lastRefreshed ? formatDate(lastRefreshed) : 'N/A'}
            </div>
            <div className='overflow-y-auto max-h-[700px]'>
              <table className='w-full text-center border-collapse border border-gray-800 rounded-t-xl overflow-hidden'>
                <thead>
                  <tr className='bg-blue-500 sticky top-0 shadow-md z-10'>
                    <th className='border border-gray-700 p-4 text-lg text-white'>
                      Rank
                    </th>
                    <th className='border border-gray-700 p-4 text-lg text-white'>
                      Username
                    </th>
                    <th className='border border-gray-700 p-4 text-lg text-white'>
                      Name
                    </th>
                    <th className='border border-gray-700 p-4 text-lg text-white'>
                      Problems Solved
                    </th>
                    <th className='border border-gray-700 p-4 text-lg text-white'>
                      Score
                    </th>
                    <th className='border border-gray-700 p-4 text-lg text-white'>
                      Last Submission
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((player, index) => (
                    <tr
                      key={player.username}
                      className={`${
                        index % 2 === 0 ? 'bg-gray-600' : 'bg-gray-500'
                      } border-t border-gray-300`}
                    >
                      <td className='border border-gray-700 p-4 text-center'>
                        {index + 1}
                      </td>
                      <td className='border border-gray-700 p-4'>
                        {player.username}
                      </td>
                      <td className='border border-gray-700 p-4'>
                        {player.name}
                      </td>
                      <td className='border border-gray-700 p-4 text-center'>
                        {player.problems_solved}
                      </td>
                      <td className='border border-gray-700 p-4 text-center'>
                        {player.score}
                      </td>
                      <td className='border border-gray-700 p-4 text-center'>
                        {player.last_submission
                          ? formatDate(new Date(player.last_submission * 1000))
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className='mb-4 mt-20 text-sm text-gray-400 text-center'>
                Platform designed and developed by{' '}
                <a
                  className='text-blue-500 hover:underline'
                  href='https://github.com/swarooppatilx'
                >
                  Swaroop Patil
                </a>{' '}
                with{' '}
                <a
                  className='text-blue-500 hover:underline'
                  href='https://adimail.github.io'
                >
                  Aditya Godse
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LeaderBoard;
