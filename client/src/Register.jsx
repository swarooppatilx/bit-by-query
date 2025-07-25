import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

  const validateUsername = (value) => {
    const regex = /^[a-zA-Z0-9_.]+$/;
    return regex.test(value);
  };

  const validatePassword = (value) => {
    return !getFirstPasswordError(value);
  };
  const getFirstPasswordError = (value) => {
    if (value.length < 8) return "At least 8 characters";
    if (!/[A-Z]/.test(value)) return "One uppercase letter";
    if (!/[a-z]/.test(value)) return "One lowercase letter";
    if (!/[0-9]/.test(value)) return "One number";
    if (!/[!@#$%^&*]/.test(value)) return "One special character (!@#$%^&*)";
    return "";
  };

  const checkPasswordStrength = (value) => {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[!@#$%^&*]/.test(value)) score++;

    if (score <= 2) return "Weak";
    else if (score === 3 || score === 4) return "Medium";
    else return "Strong";
  };

  useEffect(() => {
    const isValid =
      name.trim() !== "" &&
      validateUsername(username) &&
      validatePassword(password);
    setIsFormValid(isValid);

    if (password) setPasswordStrength(checkPasswordStrength(password));
    else setPasswordStrength("");
  }, [name, username, password]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError("Please correct the errors before submitting.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/register", {
        username,
        password,
        name,
      });

      toast.success("Registration successful!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      const message =
        err.response?.data?.error || "Unable to register. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-neutral-950 text-white flex items-center justify-center">
      <ToastContainer
        position="top-right"
        autoClose={4000}
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
            Register for Bit By Query
          </h2>

          {error && (
            <div className="bg-red-600 text-white text-center py-2 mb-4 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <hr className="border-t-2 border-gray-500 my-6 w-20 mx-auto" />

            <div className="mb-4">
              <label htmlFor="name" className="block text-lg">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

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
              {!validateUsername(username) && username && (
                <p className="text-red-400 text-sm mt-1">
                  ACM ID should not contain spaces or special characters (only _
                  and . allowed)
                </p>
              )}
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
              {password && (
                <p
                  className={`mt-1 text-sm ${
                    passwordStrength === "Strong"
                      ? "text-green-400 font-bold"
                      : passwordStrength === "Medium"
                      ? "text-yellow-400 font-bold"
                      : "text-red-400 font-bold"
                  }`}
                >
                  Strength: {passwordStrength}
                </p>
              )}
              {getFirstPasswordError(password) && password && (
                <p className="text-red-400 text-sm mt-1">
                  {getFirstPasswordError(password)}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading || !isFormValid}
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <hr className="my-6" />
            <p className="text-center text-gray-400">
              Already have an account?{" "}
              <a href="/login" className="text-blue-400 hover:underline">
                Login
              </a>
            </p>
            <p className="text-center text-gray-400">
              View ACM IDs from{" "}
              <a
                target="_blank"
                href="https://ioit.acm.org/membership/status"
                className="text-blue-400 hover:underline"
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
