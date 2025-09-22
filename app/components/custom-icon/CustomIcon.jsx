import React from 'react';
import PropTypes from 'prop-types';

const icons = {
  edit: {
    path: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536M9 11l3 3L20.485 5.515a2.121 2.121 0 00-3-3L9 11zM6 19h12"
      />
    ),
    color: 'text-blue-500 hover:text-green-700',
  },
  view: {
    path: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </>
    ),
    color: 'text-blue-500 hover:text-blue-700',
  },
  delete: {
    path: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
      />
    ),
    color: 'text-red-500 hover:text-red-700',
  },
};

const CustomIcon = ({ type, className = '', size = 5 }) => {
  const iconData = icons[type];
  if (!iconData) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={`${iconData.color} w-${size} h-${size} ${className}`}
    >
      {iconData.path}
    </svg>
  );
};

CustomIcon.propTypes = {
  type: PropTypes.oneOf(['edit', 'view', 'delete']).isRequired,
  className: PropTypes.string,
  size: PropTypes.number,
};

export default CustomIcon;
