import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  children,
  type = 'button',
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
}) => {
  const baseStyle =
    'px-4 py-2 rounded-lg transition duration-200 focus:outline-none focus:ring-2 uppercase text-sm ';

  const variants = {
    primary:
      'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400',
    secondary:
      'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {children}
    </button>
  );
};
// ✅ Props validation
Button.propTypes = {
  children: PropTypes.node.isRequired, // children must be passed
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
