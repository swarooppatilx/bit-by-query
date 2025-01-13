import Editor from "@monaco-editor/react";
import { ClipLoader } from "react-spinners";
import PropTypes from "prop-types";

const QueryEditor = ({ userQuery, setUserQuery, handleEvaluate, loading }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-green-400 mb-6">SQL Editor</h2>

      <Editor
        height="300px"
        language="sql"
        value={userQuery}
        onChange={(value) => setUserQuery(value)}
        options={{
          minimap: { enabled: false },
          fontSize: 22,
          theme: "vs-dark",
        }}
        className="border border-gray-700 rounded-md shadow-md m-4"
      />

      <div className="flex justify-end mt-4">
        <button
          onClick={handleEvaluate}
          disabled={loading}
          className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <ClipLoader
                color="#fff"
                loading={loading}
                size={20}
                className="mr-2"
              />
              Evaluating...
            </div>
          ) : (
            "Evaluate"
          )}
        </button>
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