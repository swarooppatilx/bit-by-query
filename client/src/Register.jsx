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
    <div className="w-full h-screen bg-gray-800 text-white flex items-center justify-center">
      <div className="w-full md:w-1/3 bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-green-400 mb-4 text-center">
          Register
        </h2>

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-lg">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              aria-label="Full Name"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block text-lg">
              ACM ID
            </label>
            <input
              type="text"
              id="username"
              aria-label="Username"
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
              aria-label="Password"
              className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
