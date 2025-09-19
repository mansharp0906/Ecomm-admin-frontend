import React from 'react';
import PropTypes from 'prop-types';

const SelectField = ({ label, name, value, onChange, options, error }) => {
  return (
    <div className="flex flex-col mb-4">
      {label && (
        <label htmlFor={name} className="mb-2 text-sm font-bold text-gray-700">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 bg-gray-100 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all
          ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

SelectField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default SelectField;
