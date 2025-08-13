import PropTypes from "prop-types";

const Table = ({ data, isCorrect }) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p className="text-gray-500">No data available.</p>;
  }

  const headers = Object.keys(data[0]);

  return (
    <table
      className="min-w-full bg-neutral-950 border border-gray-700 rounded-md shadow-md result-table"
      tabIndex={0}
      aria-label="SQL Query Result Table"
      role="table"
    >
      <thead>
        <tr className={isCorrect ? "bg-green-500" : "bg-red-600"}>
          {headers.map((header) => (
            <th
              key={header}
              className="py-2 px-4 text-left text-sm font-medium text-white border-b border-gray-700"
              scope="col"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td
                key={header}
                className="py-2 px-4 text-sm text-gray-300 border-b border-gray-700"
                role="cell"
              >
                {row[header]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  isCorrect: PropTypes.bool.isRequired,
};

export default Table;