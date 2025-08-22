import PropTypes from 'prop-types';


const Sidebar = ({
  problems,
  problemId,
  setProblemId,
  problemDetails,
  solvedProblems,
  remainingTime,
}) => {

  const formatDuration = (ms) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  // Helper function to compare IDs
  const isSelectedProblem = (problem) => {
    if (!problemId || !problem) return false;
    return String(problemId) === String(problem.id);
  };


  // Helper function to check if problem is solved
  const isSolvedProblem = (problem) => {
    if (!problem || !solvedProblems.length) return false;
    const problemIdAsNumber = Number(problem.id);
    return solvedProblems.includes(problemIdAsNumber);
  };


  return (
    <aside className='w-full md:w-1/3 px-6 py-4 border-r border-gray-700 bg-neutral-950 overflow-y-auto'>
      <div className="flex items-center justify-between mb-2">
        <h1 className='text-2xl font-bold text-blue-400'>Questions</h1>
        <span className="flex items-center gap-1 bg-neutral-900 border border-blue-700 rounded px-2 py-1 font-mono text-blue-300 font-bold text-base shadow-sm" title="Time left">
          <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
          {formatDuration(remainingTime)}
        </span>
      </div>
      <p className='mb-2 text-gray-200'>
        {solvedProblems.length} / {problems.length}
      </p>


      {problems.length === 0 ? (
        <p className='text-gray-400 italic'>
          No problems available. Try again later.
        </p>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[calc(5*3rem)] border border-gray-700 rounded-lg p-2 overflow-y-auto">
          {problems.map((problem, index) => (
            <button
              key={problem.id}
              className={`p-3 rounded-lg border text-sm font-medium transition-transform transform focus:outline-none ${isSelectedProblem(problem)
                  ? 'border-green-500 bg-green-600 text-white shadow-md'
                  : isSolvedProblem(problem)
                    ? 'border-blue-400 bg-blue-500 text-white shadow-sm' // Solved problems
                    : 'border-gray-500 bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              style={{
                backgroundColor: isSelectedProblem(problem)
                  ? '#059669'
                  : isSolvedProblem(problem)
                    ? '#3b82f6'
                    : '#374151'
              }}
              onClick={() => setProblemId(problem.id)}
              aria-label={`Problem ${problem.id}`}
              title={`Marks ${problem.marks}`}
            >
              <p className='text-sm'>{`Q. ${index + 1}`}</p>
              <p className='text-xs'>{`Marks ${problem.marks}`}</p>
            </button>
          ))}
        </div>
      )}


      {problemDetails && (
        <div className='mt-0'>
          <hr className='border-t-2 border-gray-500 my-3' />
          <h2 className='text-xl font-semibold text-gray-300 mb-1'>
            {problemDetails.title}
          </h2>
          <p className='text-gray-500 mb-3 text-lg'>
            {problemDetails.description}
          </p>
          {problemId && solvedProblems.includes(Number(problemId)) && (
            <div className='flex items-center gap-2 text-sm text-yellow-400'>
              <span>✅ You have already solved this problem!</span>
            </div>
          )}
          <p className='italic text-xs text-gray-200 mt-4'>
            Note: Please use <code>SELECT * from TABLE_NAME</code> to view the
            schema.
          </p>
        </div>
      )}
    </aside>
  );
};


Sidebar.propTypes = {
  problems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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
  remainingTime: PropTypes.number,
};


export default Sidebar;