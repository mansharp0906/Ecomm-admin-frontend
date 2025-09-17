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
    <div className="flex flex-col mb-4">
      {label && (
        <label className="mb-2 text-sm font-bold text-gray-700">{label}</label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 bg-gray-100 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all 
          ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
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
