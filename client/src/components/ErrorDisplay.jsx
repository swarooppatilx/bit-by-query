import PropTypes from 'prop-types';

const ErrorDisplay = ({ error, sqlError }) => {
  if (!error && !sqlError) return null;

  return (
    <>
      {error && (
        <div className="bg-red-600 text-white p-4 rounded-md my-6">{error}</div>
      )}
      {sqlError && (
        <div className="bg-red-500 text-white p-4 rounded-md my-6">
          <strong>{sqlError}</strong>
        </div>
      )}
    </>
  );
};

ErrorDisplay.propTypes = {
  error: PropTypes.string,
  sqlError: PropTypes.string,
};

export default ErrorDisplay;