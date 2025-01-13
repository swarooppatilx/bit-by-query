import PropTypes from "prop-types";
import Table from "./Table";

const QueryResult = ({ queryResult }) => {
  if (!queryResult) return null;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-green-400 mb-4">
        Evaluation Result
      </h3>
      <p className="text-lg text-gray-300 mb-4">
        Correct:{" "}
        <span
          className={queryResult.correct ? "text-green-400" : "text-red-500"}
        >
          {queryResult.correct ? "Yes" : "No"}
        </span>
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h4 className="text-xl font-medium text-green-300 mb-2">
            User Output:
          </h4>
          <Table
            data={queryResult.userOutput}
            isCorrect={queryResult.correct}
          />
        </div>

        <div className="flex-1">
          <h4 className="text-xl font-medium text-green-300 mb-2">
            Expected Output:
          </h4>
          <Table data={queryResult.expectedOutput} isCorrect={true} />
        </div>
      </div>
    </div>
  );
};

QueryResult.propTypes = {
  queryResult: PropTypes.shape({
    correct: PropTypes.bool.isRequired,
    userOutput: PropTypes.arrayOf(PropTypes.object).isRequired,
    expectedOutput: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
};

export default QueryResult;