import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const navigate = useNavigate();

  const handleCheckbox = (e) => {
    setRulesAccepted(e.target.checked);
  };

  return (
    <div className="w-full min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-blue-400">
          Bit by Query - SQL Competition Platform
        </h1>
        <button
          onClick={() => navigate("/register")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow-md"
        >
          Start Registration
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start px-8 py-10">
        {/* Project Intro */}
        <div className="max-w-4xl text-center">
          <h2 className="text-3xl font-semibold text-blue-400 mb-4">
            Welcome to Bit by Query
          </h2>
          <p className="text-gray-300 mb-6">
            A full-stack SQL competition platform where participants can test
            their SQL knowledge, compete with peers, and rise up the leaderboard.
          </p>

          {/* Rules Section */}
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-left">
            <h3 className="text-xl font-semibold text-blue-400 mb-3">
              Competition Rules & Highlights
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Each user must register before joining the contest.</li>
              <li>Contest includes SQL query challenges of varying difficulty.</li>
              <li>Leaderboard is updated in real-time based on scores.</li>
              <li>Ensure to read all instructions before starting.</li>
              <li>Any attempt of malpractice will lead to disqualification.</li>
              <li>Contest duration: <span className="text-blue-400">2 hours</span></li>
            </ul>

            {/* Rules Checkbox */}
            <div className="mt-6 flex items-center">
              <input
                type="checkbox"
                id="rules"
                checked={rulesAccepted}
                onChange={handleCheckbox}
                className="w-5 h-5 mr-3 accent-blue-500"
              />
              <label htmlFor="rules" className="text-gray-300">
                I have read and agree to all the rules & instructions
              </label>
            </div>

            {/* Start Contest Button */}
            <div className="mt-6">
              <button
                disabled={!rulesAccepted}
                className={`w-full py-3 rounded-md shadow-lg ${
                  rulesAccepted
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
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
      <footer className="w-full text-center py-4 border-t border-gray-700 text-gray-500 text-sm">
        © {new Date().getFullYear()} Bit by Query | MIT Licensed
      </footer>
    </div>
  );
};

export default LandingPage;

