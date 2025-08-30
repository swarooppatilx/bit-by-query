import PropTypes from "prop-types";

function Modal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-3/4 md:w-1/2 max-h-[80vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-2 text-blue-800">Instructions</h3>
        <hr className="mb-4 border-gray-300" />

        <ul className="space-y-3 text-gray-800">
          <li className="flex items-start gap-2">
            <span className="text-green-600">✔</span>
            <span>Maintain a stable internet connection throughout the competition.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✔</span>
            <span>Carefully read each problem statement before attempting a solution.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✔</span>
            <span>
              Before writing your solution, <code>SELECT * FROM table_name</code> to view the table schema.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✔</span>
            <span>Make sure all test cases are passed. Write generalized queries.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✔</span>
            <span>Submit your solutions within the allotted time to ensure they are evaluated.</span>
          </li>
          <li className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <span className="text-green-600">✔</span>
              <span>
                For problems involving <b>INSERT</b>, <b>UPDATE</b>, or <b>DELETE</b> queries:
              </span>
            </div>
            <ul className="ml-6 list-disc space-y-1 text-gray-700">
              <li>Provide two queries separated by a semicolon.</li>
              <li>The first query should manipulate data, and the second should display the result.</li>
            </ul>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✔</span>
            <span>For problems involving <b>SELECT</b> queries, provide a single query as your solution.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✔</span>
            <span>
              When using table names in your queries, use the exact table name provided in the question description, typically formatted as <code>table_name</code>.
            </span>
          </li>
          <li className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <span className="text-green-600">✔</span>
              <span>Problem status indicators:</span>
            </div>
            <ul className="ml-6 list-disc space-y-1 text-gray-700">
              <li>Blue box: Solved problems.</li>
              <li>Gray box: Unsolved problems.</li>
              <li>Green box: Active problems.</li>
            </ul>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✔</span>
            <span>Ensure the column names in your solution match the required column names in the expected result.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✔</span>
            <span>Use <b>MySQL syntax</b> for all queries.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✔</span>
            <span>
              When the countdown ends, a <b>Start</b> button will appear. Once the competition time is up, you will be redirected to the &quot;Times Up&quot; screen.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✔</span>
            <span>All submissions are evaluated automatically upon submission.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✔</span>
            <span>If you encounter any issues, refresh the page.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">✔</span>
            <span>Enjoy the competition and give it your best!</span>
          </li>
        </ul>

        <div className="mt-6 flex justify-end">
          <button
            className="px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md"
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
