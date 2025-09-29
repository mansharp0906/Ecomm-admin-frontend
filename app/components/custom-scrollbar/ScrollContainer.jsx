import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable Scroll Container
 * Props:
 * - children: content inside
 * - height: fixed height (default: 400px)
 * - className: extra classes
 */
const ScrollContainer = ({ children, maxHeight = '400px', className = '' }) => {
  return (
    <div
      style={{ maxHeight }}
      className={`overflow-y-auto custom-scrollbar ${className}`}
    >
      {children}
    </div>
  );
};

ScrollContainer.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.string,
  className: PropTypes.string,
};

export default ScrollContainer;
