import PropTypes from "prop-types";

const Sidebar = ({ problems, problemId, setProblemId, problemDetails }) => {
  return (
    <aside className="w-full md:w-1/3 p-6 border-r border-gray-700">
      <h1 className="text-3xl font-bold text-green-400 mb-6">Questions</h1>

      {problems.length === 0 ? (
        <p className="text-gray-300">No problems available. Try again later.</p>
      ) : (
        <div>
          <label
            htmlFor="problem"
            className="block text-lg font-medium text-gray-200 mb-2"
          >
            Select Problem:
          </label>
          <select
            id="problem"
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            onChange={(e) => setProblemId(e.target.value)}
            value={problemId}
          >
            <option value="">Select Problem</option>
            {problems.map((problem) => (
              <option key={problem.id} value={problem.id}>
                {problem.title}
              </option>
            ))}
          </select>

          {problemDetails && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-green-400 mb-4">
                {problemDetails.title}
              </h2>
              <p className="text-gray-300">{problemDetails.description}</p>
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
};

export default Sidebar;
