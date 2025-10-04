import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const Tooltip = ({
  id,
  content,
  place = 'bottom',
  variant = 'info',
  noArrow = false,
  className = 'max-w-xs bg-white bg-opacity-90 border border-gray-300 text-gray-800 text-sm rounded-lg px-4 py-2 shadow-md opacity-95 whitespace-normal break-words',
  style = {},
}) => {
  return (
    <ReactTooltip
      id={id}
      place={place}
      variant={variant}
      noArrow={noArrow}
      className={className}
      style={{ ...style, zIndex: 9999 }}
      data-testid="reusable-tooltip"
    >
      {content}
    </ReactTooltip>
  );
};

export default Tooltip;
