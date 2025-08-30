import { useEffect } from "react";
import Editor from "@monaco-editor/react";
import { ClipLoader } from "react-spinners";
import PropTypes from "prop-types";

const QueryEditor = ({ problems,problemId,setProblemId,userQuery, setUserQuery, handleEvaluate, loading }) => {
  const currentIndex = problems.findIndex((p) => String(p.id) === String(problemId));
  const handleNext = () => {
    if (currentIndex < problems.length - 1) {
      setProblemId(problems[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setProblemId(problems[currentIndex - 1].id);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'Enter') {
        handleEvaluate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleEvaluate]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-blue-400">SQL Editor</h2>
          <p className="text-gray-200 text-lg">Write your SQL query here</p>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          <button
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className={`px-4 py-2 rounded-md font-semibold text-white
              ${currentIndex <= 0 
                ? 'bg-blue-400 opacity-50 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-800 shadow-md transition duration-200'}`}
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex >= problems.length - 1}
            className={`px-4 py-2 rounded-md font-semibold text-white
              ${currentIndex >= problems.length - 1 
                ? 'bg-blue-400 opacity-50 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-800 shadow-md transition duration-200'}`}
          >
            Next
          </button>
        </div>
      </div>

      <div className='border border-gray-700 rounded-md shadow-md my-4 bg-gray-800'>
        <Editor
          height='300px'
          language='sql'
          value={userQuery}
          onChange={(value) => setUserQuery(value)}
          theme='vs-dark'
          options={{
            minimap: { enabled: false },
            fontSize: 22,
            lineNumbers: 'off',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            renderWhitespace: 'none',
            fontFamily: 'Consolas, "Courier New", monospace',
          }}
        />
      </div>

      <div className='flex flex-col items-end justify-end mt-4'>
        <button
          onClick={handleEvaluate}
          disabled={loading}
          className={`px-6 py-2 me-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <div className='flex justify-center items-center'>
              <ClipLoader
                color='#fff'
                loading={loading}
                size={20}
                className='mr-2'
              />
              Evaluating...
            </div>
          ) : (
            'Evaluate'
          )}
        </button>
        <p className='text-gray-200 my-2 text-sm'>
          Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to execute.
        </p>
      </div>
    </div>
  );
};

QueryEditor.propTypes = {
  userQuery: PropTypes.string.isRequired,
  setUserQuery: PropTypes.func.isRequired,
  handleEvaluate: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default QueryEditor;