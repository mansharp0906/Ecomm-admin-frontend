// SearchBarContainer.jsx
import React from 'react';
import PropTypes from 'prop-types';

const SearchBarContainer = ({ children, className = '' }) => {
  return (
   <div className={`px-6 py-4 bg-white border-t border-b border-gray-200  shadow-top rounded-md ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="w-full sm:w-1/3">{children}</div>
      </div>
    </div>
  );
};

SearchBarContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default SearchBarContainer;
