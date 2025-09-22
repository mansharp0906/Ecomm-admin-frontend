import React from 'react';
import PropTypes from 'prop-types';

const Container = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6  ${className}`}>
      {children}
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Container;
