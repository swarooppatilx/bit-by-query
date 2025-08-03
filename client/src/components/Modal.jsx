import PropTypes from "prop-types";

function Modal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 
                max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 text-blue-800">Instructions</h3>
        <ul className="list-disc pl-5 text-gray-800">
          <li>
            Maintain a stable internet connection throughout the competition.
          </li>
          <li>
            Carefully read each problem statement before attempting a solution.
          </li>
          <li>
            Before writing your solution, <code>SELECT * FROM table_name</code>{" "}
            to view the table schema.
          </li>
          <li>
            Make sure all test cases are passed. Write generalized queries.
          </li>
          <li>
            Submit your solutions within the allotted time to ensure they are
            evaluated.
          </li>
          <li>
            For problems involving <b>INSERT</b>, <b>UPDATE</b>, or{" "}
            <b>DELETE</b> queries:
            <ul className="list-disc pl-8">
              <li>Provide two queries separated by a semicolon.</li>
              <li>
                The first query should manipulate data, and the second should
                display the result.
              </li>
            </ul>
          </li>
          <li>
            For problems involving <b>SELECT</b> queries, provide a single query
            as your solution.
          </li>
          <li>
            When using table names in your queries, use the exact table name
            provided in the question description, typically formatted as{" "}
            <code>table_name</code>.
          </li>
          <li>
            Problem status indicators:
            <ul className="list-disc pl-8">
              <li>Blue box: Solved problems.</li>
              <li>Gray box: Unsolved problems.</li>
              <li>Green box: Active problems.</li>
            </ul>
          </li>
          <li>
            Ensure the column names in your solution match the required column
            names in the expected result.
          </li>
          <li>
            Use <b>MySQL syntax</b> for all queries.
          </li>
          <li>
            When the countdown ends, a <b>Start</b> button will appear. Once the
            competition time is up, you will be redirected to the &quot;Times
            Up&quot; screen.
          </li>
          <li>All submissions are evaluated automatically upon submission.</li>
          <li>If you encounter any issues, refresh the page.</li>
          <li>Enjoy the competition and give it your best!</li>
        </ul>
        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
