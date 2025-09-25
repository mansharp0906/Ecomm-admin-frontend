// Container.js
import React from 'react';
import PropTypes from 'prop-types';

const TableContainer = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow w-full ${className}`}
      style={{ minHeight: 'auto' }} // optional, overrides fixed min-h
    >
      {children}
    </div>
  );
};

TableContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default TableContainer;
