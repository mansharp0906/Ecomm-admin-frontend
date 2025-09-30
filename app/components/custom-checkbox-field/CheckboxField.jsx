import React from 'react';
import PropTypes from 'prop-types';

const CheckboxField = ({
  label,
  name,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  size = 'sm',
  variant = 'default',
  className = '',
  labelClassName = '',
  checkboxClassName = '',
  description,
  ...props
}) => {
  // Size variants
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  // Variant styles
  const variantClasses = {
    default:
      'text-blue-600 border-gray-300 focus:ring-blue-500 bg-white hover:bg-blue-50',
    success:
      'text-green-600 border-gray-300 focus:ring-green-500 bg-white hover:bg-green-50',
    warning:
      'text-yellow-600 border-gray-300 focus:ring-yellow-500 bg-white hover:bg-yellow-50',
    danger:
      'text-red-600 border-gray-300 focus:ring-red-500 bg-white hover:bg-red-50',
  };

  const baseCheckboxClasses = `
    rounded border-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1
    transition-all duration-200 ease-in-out
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${error ? 'border-red-500 focus:ring-red-500 bg-red-50' : ''}
    ${
      disabled
        ? 'opacity-50 cursor-not-allowed bg-gray-100'
        : 'cursor-pointer hover:shadow-md'
    }
    ${checkboxClassName}
  `.trim();

  const handleChange = (e) => {
    if (disabled) return;
    onChange(e);
  };

  return (
    <div className={`flex items-center mb-3 ${className}`}>
      <div className="flex items-center">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={value}
          onChange={handleChange}
          disabled={disabled}
          className={baseCheckboxClasses}
          {...props}
        />
        {label && (
          <label
            htmlFor={name}
            className={`ml-2 text-sm font-medium text-gray-700 cursor-pointer select-none ${
              disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:text-gray-900'
            } ${labelClassName}`}
          >
            {label}
            {required && (
              <span className="text-red-500 ml-1 font-bold">*</span>
            )}
          </label>
        )}
      </div>
      {description && (
        <p className="text-gray-500 text-xs ml-2 mt-0.5">
          {description}
        </p>
      )}
      {error && (
        <div className="ml-2">
          <p className="text-red-600 text-xs font-medium flex items-center">
            <svg
              className="w-3 h-3 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

CheckboxField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['default', 'success', 'warning', 'danger']),
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  checkboxClassName: PropTypes.string,
  description: PropTypes.string,
};

export default CheckboxField;
