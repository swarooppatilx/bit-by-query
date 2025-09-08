import React from 'react';
import { ChevronRight } from 'lucide-react';

const QuestionDetailPage = ({ selectedQuestion, onBackToQuestions }) => {
  const [showSolution, setShowSolution] = useState(false);
  const [userQuery, setUserQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <BackButton onClick={onBackToQuestions} text="Back to Questions" />
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-blue-400">{selectedQuestion?.title}</h1>
            <DifficultyBadge difficulty={selectedQuestion?.difficulty} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Problem Description */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Problem Description</h3>
              <p className="text-gray-300 mb-4">{selectedQuestion?.description}</p>
              <p className="text-sm text-gray-400">Expected Output: {selectedQuestion?.expectedOutput}</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Database Schema</h3>
              <pre className="bg-gray-900 p-4 rounded text-sm text-green-400 overflow-x-auto">
                {selectedQuestion?.schema}
              </pre>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Sample Data</h3>
              <pre className="bg-gray-900 p-4 rounded text-sm text-blue-400 overflow-x-auto">
                {selectedQuestion?.sampleData}
              </pre>
            </div>

            {showSolution && (
              <div className="bg-gray-800 rounded-lg p-6 border border-green-600">
                <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center space-x-2">
                  <CheckCircle size={20} />
                  <span>Solution</span>
                </h3>
                <pre className="bg-gray-900 p-4 rounded text-sm text-green-400 overflow-x-auto">
                  {selectedQuestion?.solution}
                </pre>
              </div>
            )}
          </div>

          {/* Query Editor */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">SQL Query Editor</h3>
              <textarea
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="Write your SQL query here..."
                className="w-full h-64 bg-gray-900 text-green-400 p-4 rounded border border-gray-600 focus:border-blue-500 focus:outline-none font-mono text-sm resize-none"
              />
              <div className="flex space-x-3 mt-4">
                <button className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
                  <Play size={16} />
                  <span>Run Query</span>
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors">
                  Submit Solution
                </button>
                <button 
                  onClick={() => setShowSolution(!showSolution)}
                  className="bg-yellow-600 hover:bg-yellow-700 px-6 py-2 rounded-lg transition-colors"
                >
                  {showSolution ? 'Hide Solution' : 'Show Solution'}
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Query Results</h3>
              <div className="bg-gray-900 p-4 rounded min-h-32">
                <p className="text-gray-400 text-sm">Results will appear here after running your query...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuestionDetailPage;