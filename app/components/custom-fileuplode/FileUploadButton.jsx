import React from 'react';
import PropTypes from 'prop-types';

const FileUploadButton = ({
  label,
  id,
  onChange,
  accept = '',
  multiple = false,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={id} className="mb-1 font-semibold">
          {label}
        </label>
      )}
      <input
        type="file"
        id={id}
        name={id}
        onChange={onChange}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="block w-full border rounded p-2 cursor-pointer text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
};

FileUploadButton.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default FileUploadButton;
