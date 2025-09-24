// Container.js
import React from 'react';
import PropTypes from 'prop-types';

const Container = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow p-6 min-h-[300px] sm:min-h-[400px] md:min-h-[550px] ${className}`}
    >
      {children}
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Container;
