import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      setError("Both fields are required");
      return;
    }

    // For the sake of this example, mock a successful login
    if (username === "admin" && password === "password") {
      navigate("/home"); // Redirect to home page
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="w-full h-screen bg-gray-800 text-white flex items-center justify-center">
      <div className="w-full md:w-1/3 bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-green-400 mb-4 text-center">
          Login
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-lg">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-lg">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
