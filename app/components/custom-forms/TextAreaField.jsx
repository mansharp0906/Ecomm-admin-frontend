import React from 'react';
import PropTypes from 'prop-types';

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder = '',
  rows = 4,
  error,
}) => {
  return (
    <div className="flex flex-col mb-4">
      {label && (
        <label htmlFor={name} className="mb-2 text-sm font-bold text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-2 bg-gray-100 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all 
          ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

TextAreaField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default TextAreaField;
