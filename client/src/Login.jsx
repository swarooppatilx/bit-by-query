import { useState } from "react";
import {UserIcon , LockClosedIcon} from '@heroicons/react/24/solid';
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  
  const handleLogin = (e) => {
  e.preventDefault();

  if (!username || !password) {
    setError("Both fields are required");
    return;
  }

  setLoading(true);
  setError(null);

  // Simulate API call
  setTimeout(() => {
  
    localStorage.setItem("authToken", "demo-token"); 

    navigate("/home");
    setUsername("");
    setPassword("");
    setLoading(false);
  }, 1500);
};



  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Inner Glass Box */}
        <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-100 mb-2">
              Login to Bit By Query
            </h2>
            <p className="text-slate-400 text-sm">
              Enter your credentials to continue
            </p>
          </div>

          {error && (
            <div className="bg-red-600/80 backdrop-blur-sm border border-red-500/50 text-red-100 text-center py-3 mb-6 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-slate-300 text-sm font-medium mb-2"
              >
                ACM ID
              </label>
                        <div className="relative w-full">
                {/* User Icon */}
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />

                {/* Input */}
                <input
                  type="text"
                  id="username"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-xl 
                            placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500
                            transition-all duration-300"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your ACM ID"
                />
              </div>

              
            </div>

            {/* Password Field */}
            <div >
              <label
                htmlFor="password"
                className="block text-slate-300 text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
             <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />

                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full pl-10 px-4 py-3 bg-gray-700 text-white border border-gray-600/50 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500/50 transition-all duration-300 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-4 flex items-center text-slate-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="text-right mt-3">
                <button className="text-sm text-slate-400 hover:text-slate-300 transition-colors duration-200">
                  Forgot password?
                </button>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-slate-700/80 backdrop-blur-sm text-white rounded-xl hover:bg-slate-600/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg border border-gray-600/50 mt-6"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-800 text-slate-400">
                New to our platform?
              </span>
            </div>
          </div>

          {/* Create Account */}
          <div className="text-center space-y-3">
            <p className="text-slate-300">
              <button className="text-slate-400 hover:text-slate-300 transition-colors duration-200 font-medium">
                Create an account
              </button>
            </p>
            <p className="text-xs text-slate-400">
              Having trouble? Contact our support team
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-emerald-500/10 backdrop-blur-sm border border-emerald-400/20 rounded-xl">
            <p className="text-center text-emerald-300 text-sm font-medium mb-2">
              Demo Credentials
            </p>
            <div className="text-center text-slate-300 text-xs space-y-1">
              <p>
                ACM ID:{" "}
                <span className="font-mono bg-white/10 px-2 py-1 rounded text-white">
                  test
                </span>
              </p>
              <p>
                Password:{" "}
                <span className="font-mono bg-white/10 px-2 py-1 rounded text-white">
                  123
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default Login;
