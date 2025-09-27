import React from 'react';
import PropTypes from 'prop-types';

const FileUploadButton = ({
  label,
  id,
  onChange,
  onFileSelect,
  accept = '',
  multiple = false,
  disabled = false,
  className = '',
  error = '',
  showPreview = false,
  previewValue = null,
}) => {
  const [selectedFiles, setSelectedFiles] = React.useState([]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    
    // Update selected files state for preview
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
    
    // Call onChange if provided
    if (onChange) {
      onChange(e);
    }
    
    // Call onFileSelect if provided
    if (onFileSelect && files && files.length > 0) {
      if (multiple) {
        onFileSelect(Array.from(files));
      } else {
        onFileSelect(files[0]);
      }
    }
  };

  // Generate preview URLs
  const previewUrls = React.useMemo(() => {
    if (showPreview && selectedFiles.length > 0) {
      return selectedFiles.map(file => URL.createObjectURL(file));
    }
    return [];
  }, [selectedFiles, showPreview]);

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={id} className="mb-1 font-semibold text-gray-700">
          {label}
        </label>
      )}
      
      {/* File Input */}
      <input
        type="file"
        id={id}
        name={id}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className={`block w-full border rounded p-2 cursor-pointer text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />

      {/* File Preview */}
      {showPreview && previewUrls.length > 0 && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <div className="flex flex-wrap gap-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                {selectedFiles[index]?.type?.startsWith('image/') ? (
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded border flex items-center justify-center">
                    <span className="text-xs text-gray-500">
                      {selectedFiles[index]?.name?.substring(0, 8)}...
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing URL Preview */}
      {showPreview && previewValue && previewValue.startsWith('http') && (
        <div className="mt-2">
          <p className="text-sm text-gray-600 mb-2">Current:</p>
          <img
            src={previewValue}
            alt="Current file"
            className="w-20 h-20 object-cover rounded border"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

FileUploadButton.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onFileSelect: PropTypes.func,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.string,
  showPreview: PropTypes.bool,
  previewValue: PropTypes.string,
};

export default FileUploadButton;
