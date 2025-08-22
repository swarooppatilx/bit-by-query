import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import confetti from "canvas-confetti";
import Table from "./Table";

const QueryResult = ({ queryResult }) => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (queryResult?.correct) {
      const end = Date.now() + 500;
      const colors = ["#bb0000", "#ffffff", "#00bb00", "#0000bb", "#ffbb00"];
      const frame = () => {
        confetti({
          particleCount: 10,
          angle: 60,
          spread: 100,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 10,
          angle: 120,
          spread: 100,
          origin: { x: 1 },
          colors: colors,
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [queryResult?.correct]);

  if (!queryResult) return null;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-blue-400 mb-4">
        Evaluation Result
      </h3>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg text-gray-300">Overall Result:</span>
          {queryResult.correct ? (
            <span className="flex items-center gap-1 text-blue-400">
              <Check className="w-5 h-5" /> All Test Cases Passed
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-500">
              <X className="w-5 h-5" /> Some Test Cases Failed
            </span>
          )}
          <span className="text-gray-400 ml-4">
            Duration: {queryResult.duration}
          </span>
        </div>
      </div>

      <div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700">
          {queryResult.testResults.map((testCase, index) => (
            <button
              key={index}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === index
                  ? "border-b-2 border-green-400 text-green-300"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab(index)}
            >
              Test Case {testCase.testCaseNumber}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <div className="p-6 border border-gray-700 rounded-lg mt-4">
          {queryResult.testResults[activeTab] && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-medium text-green-300">
                  Test Case {queryResult.testResults[activeTab].testCaseNumber}
                </h4>
                {queryResult.testResults[activeTab].passed ? (
                  <span className="flex items-center gap-1 text-blue-400">
                    <Check className="w-5 h-5" /> Passed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-500">
                    <X className="w-5 h-5" /> Failed
                  </span>
                )}
              </div>

              {queryResult.testResults[activeTab].error ? (
                <div className="text-red-400 bg-red-900/20 rounded p-4">
                  Error: {queryResult.testResults[activeTab].error}
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h5 className="text-lg font-medium text-green-300 mb-2">
                      Your Output:
                    </h5>
                    <div className="result-table-scroll-wrapper">
                      <Table
                        data={queryResult.testResults[activeTab].userOutput}
                        isCorrect={queryResult.testResults[activeTab].passed}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg font-medium text-green-300 mb-2">
                      Expected Output:
                    </h5>
                    <div className="result-table-scroll-wrapper">
                      <Table
                        data={queryResult.testResults[activeTab].expectedOutput}
                        isCorrect={true}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

QueryResult.propTypes = {
  queryResult: PropTypes.shape({
    correct: PropTypes.bool.isRequired,
    duration: PropTypes.string.isRequired,
    testResults: PropTypes.arrayOf(
      PropTypes.shape({
        testCaseNumber: PropTypes.number.isRequired,
        passed: PropTypes.bool.isRequired,
        userOutput: PropTypes.array.isRequired,
        expectedOutput: PropTypes.array.isRequired,
        error: PropTypes.string,
      })
    ).isRequired,
  }),
};

export default QueryResult;
