import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "./redux/slices/authSlice"; // adjust path
import { Check } from "lucide-react"; 

const LandingPage = () => {
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch user info on mount
  useEffect(() => {
    fetch("/api/userinfo", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        console.log("userinfo response:", data);
        if (data && !data.error) {
          setUserInfo(data);
          dispatch(login(data));   // 🔥 update Redux state
        }
      })
      .catch(() => setUserInfo(null));
  }, [dispatch]);

  const handleCheckbox = (e) => {
    setRulesAccepted(e.target.checked);
  };

  const handleStartContest = () => {
    if (!rulesAccepted) return;
    if (userInfo) {
      navigate("/home"); // logged in → contest
    } else {
      navigate("/login"); // not logged in → login
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Header */}
      <header className="w-full flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-4 border-b border-gray-700 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-400 text-center sm:text-left">
          Bit by Query - SQL Competition Platform
        </h1>

        {userInfo ? (
          <div className="flex items-center bg-blue-800/30 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md w-full sm:w-auto justify-center">
            <Check className="w-4 h-4 mr-2 text-blue-400" />
            <span className="text-gray-300 text-sm sm:text-base">
              Logged in as{" "}
              <span className="text-blue-400 font-semibold">
                {userInfo.username}
              </span>
            </span>
          </div>
        ) : (
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 rounded-md shadow-md w-full sm:w-auto text-sm sm:text-base"
          >
            Start Registration
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-8 py-6 sm:py-10">
        {/* Project Intro */}
        <div className="max-w-4xl w-full text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-blue-400 mb-4">
            Welcome to Bit by Query
          </h2>
          <p className="text-gray-300 mb-6 text-sm sm:text-base px-2">
            A full-stack SQL competition platform where participants can test
            their SQL knowledge, compete with peers, and rise up the leaderboard.
          </p>

          {/* Rules Section */}
          <div className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-lg text-left">
            <h3 className="text-lg sm:text-xl font-semibold text-blue-400 mb-3">
              Competition Rules & Highlights
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm sm:text-base">
              <li>Each user must register before joining the contest.</li>
              <li>Contest includes SQL query challenges of varying difficulty.</li>
              <li>Leaderboard is updated in real-time based on scores.</li>
              <li>Ensure to read all instructions before starting.</li>
              <li>Any attempt of malpractice will lead to disqualification.</li>
              <li>
                Contest duration:{" "}
                <span className="text-blue-400">2 hours</span>
              </li>
            </ul>

            {/* Rules Checkbox */}
            <div className="mt-6 flex items-start sm:items-center">
              <input
                type="checkbox"
                id="rules"
                checked={rulesAccepted}
                onChange={handleCheckbox}
                className="w-5 h-5 mr-3 accent-blue-500 mt-1 sm:mt-0 flex-shrink-0"
              />
              <label htmlFor="rules" className="text-gray-300 text-sm sm:text-base">
                I have read and agree to all the rules & instructions
              </label>
            </div>

            {/* Start Contest Button */}
            <div className="mt-6">
              <button
                onClick={handleStartContest}
                disabled={!rulesAccepted}
                className={`w-full py-3 rounded-md shadow-lg text-sm sm:text-base ${
                  rulesAccepted
                    ? "bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                Start Contest
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 border-t border-gray-700 text-gray-500 text-xs sm:text-sm px-4">
        © {new Date().getFullYear()} Bit by Query | MIT Licensed
      </footer>
    </div>
  );
};

export default LandingPage;