import PropTypes from "prop-types";

const Sidebar = ({
  problems,
  problemId,
  setProblemId,
  problemDetails,
  solvedProblems,
}) => {
  return (
    <aside className="w-full md:w-1/3 p-6 border-r border-gray-700 bg-gray-800">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Questions</h1>

      {problems.length === 0 ? (
        <p className="text-gray-400 italic">
          No problems available. Try again later.
        </p>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[calc(5*3rem)] overflow-y-auto border border-gray-700 rounded-lg p-2">
          {problems.map((problem) => (
            <button
              key={problem.id}
              className={`p-3 rounded-lg border text-sm font-medium transition-transform transform hover:scale-105 focus:outline-none ${
                problemId === problem.id
                  ? "border-green-400 bg-green-500 text-white shadow-md"
                  : solvedProblems.includes(problem.id)
                  ? "border-blue-400 bg-blue-500 text-white shadow-sm" // Solved problems
                  : "border-gray-500 bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              onClick={() => setProblemId(problem.id)}
              aria-label={`Problem ${problem.id}`}
              title={`Marks ${problem.marks}`}
            >
              {`Q${problem.id}`}
            </button>
          ))}
        </div>
      )}

      {problemDetails && (
        <div className="mt-8 p-4 bg-gray-700 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-green-400 mb-3">
            {problemDetails.title}
          </h2>
          <p className="text-gray-300 mb-4 text-lg">{problemDetails.description}</p>
          {solvedProblems.includes(problemId) && (
            <div className="flex items-center gap-2 text-sm text-yellow-400">
              <span>✅ You have already solved this problem!</span>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

Sidebar.propTypes = {
  problems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
  problemId: PropTypes.string.isRequired,
  setProblemId: PropTypes.func.isRequired,
  problemDetails: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }),
  solvedProblems: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Sidebar;
