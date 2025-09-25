import React from 'react';
import PropTypes from 'prop-types';

const DataNotFound = ({ title, message, icon }) => {
  return (
    <div className="flex flex-col justify-center items-center py-48">
      <div className="text-gray-400 mb-6">
        {icon ? (
          <div className="mx-auto h-20 w-20">{icon}</div>
        ) : (
          /* Improved SVG illustration */
          <svg
            className="mx-auto h-20 w-20"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="No data illustration"
          >
            <defs>
              <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#E6F0FF" />
                <stop offset="100%" stopColor="#F8FAFF" />
              </linearGradient>
              <linearGradient id="g2" x1="0" x2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#60A5FA" />
              </linearGradient>
            </defs>

            {/* background rounded card */}
            <rect
              x="6"
              y="12"
              width="108"
              height="84"
              rx="10"
              fill="url(#g1)"
            />

            {/* empty box icon */}
            <g transform="translate(20,22)">
              <rect
                x="0"
                y="12"
                width="64"
                height="36"
                rx="4"
                fill="#fff"
                stroke="#E6EEF9"
                strokeWidth="1.5"
              />
              <path
                d="M0 12 L32 0 L64 12"
                fill="#fff"
                stroke="#E6EEF9"
                strokeWidth="1.5"
              />
              <rect
                x="10"
                y="20"
                width="44"
                height="20"
                rx="3"
                fill="url(#g1)"
              />
            </g>

            {/* magnifier */}
            <g transform="translate(66,56)">
              <circle
                cx="10"
                cy="10"
                r="10"
                fill="white"
                stroke="url(#g2)"
                strokeWidth="2.5"
              />
              <path
                d="M17 17 L26 26"
                stroke="#60A5FA"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>

            {/* subtle sparkle */}
            <g transform="translate(18,68)" opacity="0.9">
              <path
                d="M6 0 L8 4 L12 6 L8 8 L6 12 L4 8 L0 6 L4 4 Z"
                fill="#FCE9A6"
                transform="scale(0.9) translate(2,0)"
              />
            </g>

            {/* headline accent */}
            <path
              d="M16 96 H104"
              stroke="#E8EEF9"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 text-base">{message}</p>
    </div>
  );
};

DataNotFound.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  icon: PropTypes.node,
};

DataNotFound.defaultProps = {
  title: 'No data found',
  message: 'There is no data to display right now.',
  icon: null,
};

export default DataNotFound;
