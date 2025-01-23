import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password || !name) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Send register request to the backend
      const response = await axios.post("/api/register", {
        username,
        password,
        name,
      });

      console.log(response.data)
      // Registration successful, redirect to login page
      navigate("/login");
    } catch (err) {
      // Handle errors
      const message =
        err.response?.data?.error || "Unable to register. Please try again.";
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
            Register for Bit By Query
          </h2>

          {error && (
            <div className='bg-red-600 text-white text-center py-2 mb-4 rounded-md'>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <hr className='border-t-2 border-gray-500 my-6 w-20 mx-auto' />

            <div className='mb-4'>
              <label htmlFor='name' className='block text-lg'>
                Full Name
              </label>
              <input
                type='text'
                id='name'
                aria-label='Full Name'
                className='w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Enter your full name'
                required
              />
            </div>

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
              {loading ? 'Registering...' : 'Register'}
            </button>

            <hr className='my-6' />
            <p className='text-center text-gray-400'>
              Already have an account?{' '}
              <a href='/login' className='text-blue-400 hover:underline'>
                Login
              </a>
            </p>
            <p className='text-center text-gray-400'>
              View ACM IDs from{' '}
              <a
                target="_blank"
                href='https://ioit.acm.org/membership/status'
                className='text-blue-400 hover:underline'
              >
                Here
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
        

export default Register;
