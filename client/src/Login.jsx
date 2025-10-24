import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import apiClient from "./apiClient";
import { ToastContainer, toast } from "react-toastify";
import { login } from "./redux/slices/authSlice";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Both fields are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post("/api/login", {
        username,
        password,
      });

      const user = response.data.user;
      dispatch(login(user));

      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/home");
      }, 3500);
    } catch (err) {
      const message =
        err.response?.data?.error || "Unable to login. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full h-screen bg-neutral-950 text-white flex items-center justify-center">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        theme="colored"
      />
      <div className="w-full max-w-2xl grid grid-cols-1 p-8">
        <div>
          <h2 className="text-3xl font-bold text-blue-400 mb-4 text-center">
            Login to Bit By Query
          </h2>

          {error && (
            <div className="bg-red-600 text-white text-center py-2 mb-4 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <hr className="border-t-2 border-gray-500 my-6 w-20 mx-auto" />

            <div className="mb-4">
              <label htmlFor="username" className="block text-lg">
                ACM ID
              </label>
              <input
                type="text"
                id="username"
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter ACM ID"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-lg">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              <button
  type="button"
  className="absolute inset-y-0 right-0 px-4 flex items-center justify-center text-white hover:text-blue-400 transition-colors duration-200"
  onClick={togglePasswordVisibility}
  tabIndex={-1}
>
  {showPassword ? (
    // Password is visible → show EYE icon
    <svg
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 4 12.001 4c4.97 0 9.185 2.975 10.675 7.552.12.362.12.752 0 1.113-1.487 4.471-5.705 7.447-10.677 7.447-4.97 0-9.186-2.975-10.675-7.552a1.54 1.54 0 0 1 0-1.113ZM17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" clipRule="evenodd"/>
    </svg>
  ) : (
    // Password is hidden → show EYE SLASH icon
    <svg
      className="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 4 12.001 4c4.97 0 9.185 2.975 10.675 7.552.12.362.12.752 0 1.113-1.487 4.471-5.705 7.447-10.677 7.447-4.97 0-9.186-2.975-10.675-7.552a1.54 1.54 0 0 1 0-1.113ZM17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" clipRule="evenodd"/>
      <path d="m3.707 2.293 18 18 1.414-1.414-18-18-1.414 1.414Z"/>
    </svg>
  )}
</button>

              </div>
              <div className="text-right mt-2">
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-400 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 font-medium"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <hr className="my-6 border-gray-700" />
            <p className="text-center text-gray-400 mb-2">
              New user?{" "}
              <a href="/register" className="text-blue-400 hover:underline font-medium">
                Sign up
              </a>
            </p>
            <p className="text-center text-gray-400 text-sm mb-2">
              Difficulties logging in? Contact team members.
            </p>
            <p className="text-center text-gray-400 text-sm">
              <span className="text-green-400">Dummy Credentials:</span>
              <br />
              ACM ID: <strong>test</strong>, Pass: <strong>123</strong>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;