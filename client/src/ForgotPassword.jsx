import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles the form submission to request a password reset link.
   * @param {React.FormEvent<HTMLFormElement>} e 
   */
  const handleResetRequest = async (e) => {
    e.preventDefault();

    // Basic validation to ensure the field is not empty
    if (!email) {
      setError("ACM ID or Email is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Replace "/api/forgot-password" with your actual backend endpoint for password resets.
      const response = await axios.post("/api/forgot-password", {
        email, // Or username, depending on what your backend expects
      });

      // Show a success message to the user
      toast.success("Password reset link sent successfully!");

      // After a delay, redirect the user back to the login page
      setTimeout(() => {
        navigate("/login");
      }, 3500);

    } catch (err) {
      // Extract a user-friendly error message from the server response or provide a default one.
      const message =
        err.response?.data?.error || "Failed to send reset link. Please try again.";
      setError(message); // Display the error in the UI
    } finally {
      // Ensure the loading state is reset regardless of the outcome
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-neutral-950 text-white flex items-center justify-center">
      {/* ToastContainer for displaying notifications */}
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
            Forgot Password
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Enter your ACM ID or email to receive a password reset link.
          </p>

          {/* Display error message if one exists */}
          {error && (
            <div className="bg-red-600 text-white text-center py-2 mb-4 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleResetRequest}>
            <hr className="border-t-2 border-gray-500 my-6 w-20 mx-auto" />

            <div className="mb-4">
              <label htmlFor="email" className="block text-lg">
                ACM ID or Email
              </label>
              <input
                type="text" // Using "text" to allow for either username or email
                id="email"
                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your ACM ID or email"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 mt-4"
              disabled={loading}
            >
              {loading ? "Sending Link..." : "Send Reset Link"}
            </button>

            <hr className="my-6" />
            <p className="text-center text-gray-400">
              Remembered password?{" "}
              <a href="/login" className="text-blue-400 hover:underline">
                Back to Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
