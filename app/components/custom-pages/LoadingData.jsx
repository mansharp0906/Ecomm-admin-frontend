import React from 'react';
import PropTypes from 'prop-types';

const LoadingData = ({ message, size }) => {
  return (
    <div className="flex flex-col justify-center items-center h-[480px]">
      <div
        className={'animate-spin rounded-full border-b-4 border-blue-600'}
        style={{
          width: size,
          height: size,
        }}
      ></div>
      {message && <span className="mt-4 text-gray-700">{message}</span>}
    </div>
  );
};

LoadingData.propTypes = {
  message: PropTypes.string,
  size: PropTypes.string,
};

LoadingData.defaultProps = {
  message: 'Loading...',
  size: '40px',
};

export default LoadingData;
