/**
 * File Upload Handler Utility
 * Handles file uploads, previews, and form data updates
 */

/**
 * Handle single file upload with preview
 * @param {File} file - File object
 * @param {Function} setFormData - Form data setter function
 * @param {string} fieldName - Field name for the file
 * @param {Object} options - Additional options
 */
export const handleFileUpload = (
  file,
  setFormData,
  fieldName,
  options = {},
) => {
  if (!file) return;

  const { createPreview = true, clearErrors = null } = options;

  setFormData((prev) => {
    const newData = { ...prev };

    // Store the actual file
    newData[`${fieldName}File`] = file;

    // Create preview URL if requested
    if (createPreview) {
      const previewUrl = URL.createObjectURL(file);
      newData[fieldName] = previewUrl;
    }

    return newData;
  });

  // Clear field errors if provided
  if (clearErrors && typeof clearErrors === 'function') {
    clearErrors(fieldName);
  }
};

/**
 * Handle multiple file uploads with previews
 * @param {FileList|Array} files - Files to upload
 * @param {Function} setFormData - Form data setter function
 * @param {string} fieldName - Field name for the files
 * @param {Object} options - Additional options
 */
export const handleMultipleFileUpload = (
  files,
  setFormData,
  fieldName,
  options = {},
) => {
  if (!files || files.length === 0) return;

  const {
    createPreview = true,
    clearErrors = null,
    preventDuplicates = true,
    maxFiles = 10,
  } = options;

  const newFiles = Array.from(files);

  // Limit number of files
  if (newFiles.length > maxFiles) {
    console.warn(`Maximum ${maxFiles} files allowed`);
    return;
  }

  setFormData((prev) => {
    const existingFiles = prev[fieldName] || [];
    const existingPreviews = prev[`${fieldName}Preview`] || [];

    let filesToAdd = newFiles;
    let previewsToAdd = [];

    // Prevent duplicates if enabled
    if (preventDuplicates) {
      filesToAdd = newFiles.filter(
        (newFile) =>
          !existingFiles.some(
            (existingFile) =>
              existingFile.name === newFile.name &&
              existingFile.size === newFile.size,
          ),
      );
    }

    // Create preview URLs if requested
    if (createPreview) {
      previewsToAdd = filesToAdd.map((file) => URL.createObjectURL(file));
    }

    return {
      ...prev,
      [fieldName]: [...existingFiles, ...filesToAdd],
      [`${fieldName}Preview`]: [...existingPreviews, ...previewsToAdd],
    };
  });

  // Clear field errors if provided
  if (clearErrors && typeof clearErrors === 'function') {
    clearErrors(fieldName);
  }
};

/**
 * Remove file from multiple file upload
 * @param {number} index - Index of file to remove
 * @param {Function} setFormData - Form data setter function
 * @param {string} fieldName - Field name for the files
 */
export const removeFileFromUpload = (index, setFormData, fieldName) => {
  setFormData((prev) => {
    const existingFiles = prev[fieldName] || [];
    const existingPreviews = prev[`${fieldName}Preview`] || [];

    // Revoke object URL to prevent memory leaks
    if (existingPreviews[index]) {
      URL.revokeObjectURL(existingPreviews[index]);
    }

    return {
      ...prev,
      [fieldName]: existingFiles.filter((_, i) => i !== index),
      [`${fieldName}Preview`]: existingPreviews.filter((_, i) => i !== index),
    };
  });
};

/**
 * Clear all files from upload
 * @param {Function} setFormData - Form data setter function
 * @param {string} fieldName - Field name for the files
 */
export const clearAllFiles = (setFormData, fieldName) => {
  setFormData((prev) => {
    const existingPreviews = prev[`${fieldName}Preview`] || [];

    // Revoke all object URLs to prevent memory leaks
    existingPreviews.forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });

    return {
      ...prev,
      [fieldName]: [],
      [`${fieldName}Preview`]: [],
      [`${fieldName}File`]: null,
    };
  });
};

/**
 * Handle file input change event
 * @param {Event} event - File input change event
 * @param {Function} setFormData - Form data setter function
 * @param {string} fieldName - Field name for the files
 * @param {Object} options - Additional options
 */
export const handleFileInputChange = (
  event,
  setFormData,
  fieldName,
  options = {},
) => {
  const { multiple = false, ...otherOptions } = options;

  if (multiple) {
    handleMultipleFileUpload(
      event.target.files,
      setFormData,
      fieldName,
      otherOptions,
    );
  } else {
    handleFileUpload(
      event.target.files[0],
      setFormData,
      fieldName,
      otherOptions,
    );
  }

  // Reset input value to allow selecting the same file again
  event.target.value = '';
};

/**
 * Validate file type
 * @param {File} file - File to validate
 * @param {Array} allowedTypes - Allowed MIME types
 * @param {Array} allowedExtensions - Allowed file extensions
 * @returns {Object} Validation result
 */
export const validateFileType = (
  file,
  allowedTypes = [],
  allowedExtensions = [],
) => {
  const result = { isValid: true, error: null };

  if (!file) {
    result.isValid = false;
    result.error = 'No file selected';
    return result;
  }

  // Check MIME type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    result.isValid = false;
    result.error = `File type ${
      file.type
    } is not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    return result;
  }

  // Check file extension
  if (allowedExtensions.length > 0) {
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      result.isValid = false;
      result.error = `File extension ${fileExtension} is not allowed. Allowed extensions: ${allowedExtensions.join(
        ', ',
      )}`;
      return result;
    }
  }

  return result;
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSizeInMB - Maximum file size in MB
 * @returns {Object} Validation result
 */
export const validateFileSize = (file, maxSizeInMB = 10) => {
  const result = { isValid: true, error: null };

  if (!file) {
    result.isValid = false;
    result.error = 'No file selected';
    return result;
  }

  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (file.size > maxSizeInBytes) {
    result.isValid = false;
    result.error = `File size ${(file.size / 1024 / 1024).toFixed(
      2,
    )}MB exceeds maximum allowed size of ${maxSizeInMB}MB`;
    return result;
  }

  return result;
};

/**
 * Comprehensive file validation
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    allowedTypes = [],
    allowedExtensions = [],
    maxSizeInMB = 10,
    required = false,
  } = options;

  // Check if file is required
  if (required && !file) {
    return { isValid: false, error: 'File is required' };
  }

  if (!file) {
    return { isValid: true, error: null };
  }

  // Validate file type
  const typeValidation = validateFileType(
    file,
    allowedTypes,
    allowedExtensions,
  );
  if (!typeValidation.isValid) {
    return typeValidation;
  }

  // Validate file size
  const sizeValidation = validateFileSize(file, maxSizeInMB);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  return { isValid: true, error: null };
};
