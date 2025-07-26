import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
      const response = await axios.post("/api/login", {
        username,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("authToken", token);

      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/home");
      }, 3500);
    } catch (err) {
      const message =
        err.response?.data?.error || "Unable to login. Please try again.";
      setError(message); // show error in UI
    } finally {
      setLoading(false);
    }
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
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
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
                  type="password"
                  id="password"
                  className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 py-2 text-gray-400"
                  tabIndex={-1}
                >
                  <i className="fas fa-eye"></i>
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
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <hr className="my-6" />
            <p className="text-center text-gray-400">
              New user?{" "}
              <a href="/register" className="text-blue-400 hover:underline">
                Sign up
              </a>
            </p>
            <p className="text-center text-gray-400">
              Difficulties logging in? Contact team members.
            </p>
            <p className="text-center text-gray-400">
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
