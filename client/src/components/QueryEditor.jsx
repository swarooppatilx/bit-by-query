import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { ClipLoader } from "react-spinners";
import PropTypes from "prop-types";

import { RotateCcw } from "lucide-react";

const QueryEditor = ({ userQuery, setUserQuery, handleEvaluate, loading, handleReset }) => {
  const resetBtnRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl+Enter for Evaluate
      if (event.ctrlKey && event.key === 'Enter') {
        handleEvaluate();
      }
      // Ctrl+Shift+R for Reset
      if (event.ctrlKey && event.shiftKey && (event.key === 'r' || event.key === 'R')) {
        if (resetBtnRef.current) {
          resetBtnRef.current.focus();
        }
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleEvaluate, handleReset]);

  return (
    <div>
      <h2 className='text-2xl font-bold text-blue-400'>SQL Editor</h2>
      <p className='text-gray-200 mb-6 text-lg'>Write your SQL query here</p>

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
        <div className='flex gap-2 group'>
          <button
            onClick={handleEvaluate}
            disabled={loading}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold transition-all duration-150 shadow-sm ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Run Query (Ctrl+Enter)"
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
              <span className="flex items-center gap-2">
                <span>Evaluate</span>
                <kbd className="ml-1 px-1 py-0.5 text-xs bg-blue-800/60 rounded">Ctrl+Enter</kbd>
              </span>
            )}
          </button>
          <button
            ref={resetBtnRef}
            onClick={handleReset}
            disabled={loading}
            className={`px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 font-semibold flex items-center gap-2 transition-all duration-150 shadow-sm group/reset-btn ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Reset Query and Results (Ctrl+Shift+R)"
            tabIndex={0}
            title="Reset editor, results, and errors (Ctrl+Shift+R)"
            style={{animation: 'none'}}
            onMouseDown={e => {
              // Add a quick animation on click
              e.currentTarget.style.animation = 'resetPulse 0.3s';
            }}
            onAnimationEnd={e => {
              e.currentTarget.style.animation = 'none';
            }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
            <kbd className="ml-1 px-1 py-0.5 text-xs bg-gray-800/60 rounded hidden md:inline">Ctrl+Shift+R</kbd>
          </button>
        </div>
        <p className='text-gray-200 my-2 text-sm'>
          <span>Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to execute. </span>
          <span className="ml-2">Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd> to reset.</span>
        </p>
      </div>
// Animation for reset button is now in App.css
    </div>
  );
};

QueryEditor.propTypes = {
  userQuery: PropTypes.string.isRequired,
  setUserQuery: PropTypes.func.isRequired,
  handleEvaluate: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  handleReset: PropTypes.func.isRequired,
};

export default QueryEditor;