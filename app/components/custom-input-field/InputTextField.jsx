import React from 'react';
import PropTypes from 'prop-types';

const InputTextField = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  error,
}) => {
  return (
    <div className="flex flex-col mb-5">
      {label && (
        <label htmlFor={name} className="mb-2 text-sm font-bold text-gray-700">
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-blue-900 
          transition duration-200 ease-in-out
          ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300'
          }`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};

InputTextField.propTypes = {
  label: PropTypes.string,
  type: PropTypes.oneOf(['text', 'email', 'number', 'password', 'url']),
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default InputTextField;
