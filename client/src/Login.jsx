import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      setError('Both fields are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Send login request to the backend
      const response = await axios.post('/api/login', {
        username,
        password,
      });

      const { token } = response.data;

      // Save the token in localStorage
      localStorage.setItem('authToken', token);

      // Redirect to home page
      navigate('/home');
    } catch (err) {
      // Handle errors
      const message =
        err.response?.data?.error || 'Unable to login. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-screen bg-neutral-950 text-white flex items-center justify-center'>
      <div className='w-full max-w-2xl grid grid-cols-1 p-8'>
        <div>
          <h2 className='text-3xl font-bold text-blue-400 mb-4 text-center'>
            Login to Bit By Query
          </h2>

          {error && (
            <div className='bg-red-600 text-white text-center py-2 mb-4'>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <hr className='border-t-2 border-gray-500 my-6 w-20 mx-auto' />

            <div className='mb-4'>
              <label htmlFor='username' className='block text-lg'>
                ACM ID
              </label>
              <input
                type='text'
                id='username'
                aria-label='Username'
                className='w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Enter ACM ID'
                required
              />
            </div>

            <div className='mb-6'>
              <label htmlFor='password' className='block text-lg'>
                Password
              </label>
              <div className='relative'>
                <input
                  type='password'
                  id='password'
                  aria-label='Password'
                  className='w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='Enter password'
                  required
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 px-3 py-2 text-gray-400'
                >
                  <i className='fas fa-eye'></i>
                </button>
              </div>
            </div>

            <button
              type='submit'
              className='w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <hr className='my-6' />
            <p className='text-center text-gray-400'>
              New user?{' '}
              <a href='/register' className='text-blue-400 hover:underline'>
                Sign up
              </a>
            </p>
            <p className='text-center text-gray-400'>
              Difficulties logging in? Contact team members.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
