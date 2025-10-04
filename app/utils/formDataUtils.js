/**
 * Form Data Utilities
 * Common form data manipulation and processing functions
 */

/**
 * Create default form data object
 * @param {Object} defaultValues - Default values for the form
 * @returns {Object} Form data object
 */
export const createDefaultFormData = (defaultValues = {}) => {
  return {
    name: '',
    title: '',
    description: '',
    status: 'active',
    featured: false,
    priority: 1,
    ...defaultValues,
  };
};

/**
 * Reset form data to default values
 * @param {Function} setFormData - Form data setter function
 * @param {Object} defaultValues - Default values to reset to
 */
export const resetFormData = (setFormData, defaultValues = {}) => {
  setFormData(createDefaultFormData(defaultValues));
};

/**
 * Update form data field
 * @param {Function} setFormData - Form data setter function
 * @param {string} fieldName - Field name to update
 * @param {any} value - New value
 * @param {Object} options - Additional options
 */
export const updateFormDataField = (
  setFormData,
  fieldName,
  value,
  options = {},
) => {
  const { clearErrors = null, clearRelatedFields = [] } = options;

  setFormData((prev) => {
    const newData = { ...prev, [fieldName]: value };

    // Clear related fields if specified
    clearRelatedFields.forEach((field) => {
      newData[field] = '';
    });

    return newData;
  });

  // Clear field errors if provided
  if (clearErrors && typeof clearErrors === 'function') {
    clearErrors(fieldName);
  }
};

/**
 * Handle input change event
 * @param {Event} event - Input change event
 * @param {Function} setFormData - Form data setter function
 * @param {Function} clearErrors - Error clearing function
 * @param {Object} options - Additional options
 */
export const handleInputChange = (
  event,
  setFormData,
  clearErrors,
  options = {},
) => {
  const { name, value, type, checked } = event.target;
  const { clearRelatedFields = [] } = options;

  // Determine the actual value based on input type
  const actualValue = type === 'checkbox' ? checked : value;

  // Update form data
  updateFormDataField(setFormData, name, actualValue, {
    clearErrors,
    clearRelatedFields,
  });

  // Clear field error when user starts typing/selecting
  if (clearErrors && actualValue && actualValue.toString().trim() !== '') {
    clearErrors(name);
  }
};

/**
 * Process form data before API submission
 * @param {Object} formData - Raw form data
 * @param {Object} options - Processing options
 * @returns {Object} Processed form data
 */
export const processFormData = (formData, options = {}) => {
  const {
    excludeFields = [],
    transformFields = {},
    defaultValues = {},
  } = options;

  const processed = { ...formData };

  // Remove excluded fields
  excludeFields.forEach((field) => {
    delete processed[field];
  });

  // Apply field transformations
  Object.keys(transformFields).forEach((field) => {
    const transformer = transformFields[field];
    if (typeof transformer === 'function') {
      processed[field] = transformer(processed[field]);
    } else {
      processed[field] = transformer;
    }
  });

  // Apply default values for missing fields
  Object.keys(defaultValues).forEach((field) => {
    if (
      processed[field] === undefined ||
      processed[field] === null ||
      processed[field] === ''
    ) {
      processed[field] = defaultValues[field];
    }
  });

  return processed;
};

/**
 * Validate required fields
 * @param {Object} formData - Form data to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result
 */
export const validateRequiredFields = (formData, requiredFields = []) => {
  const errors = {};

  requiredFields.forEach((field) => {
    const value = formData[field];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors[field] = `${field} is required`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Convert form data to API format
 * @param {Object} formData - Form data
 * @param {Object} fieldMappings - Field name mappings
 * @returns {Object} API formatted data
 */
export const convertToApiFormat = (formData, fieldMappings = {}) => {
  const apiData = {};

  Object.keys(formData).forEach((key) => {
    const apiKey = fieldMappings[key] || key;
    apiData[apiKey] = formData[key];
  });

  return apiData;
};

/**
 * Convert API data to form format
 * @param {Object} apiData - API data
 * @param {Object} fieldMappings - Field name mappings (reverse)
 * @returns {Object} Form formatted data
 */
export const convertFromApiFormat = (apiData, fieldMappings = {}) => {
  const formData = {};

  Object.keys(apiData).forEach((key) => {
    const formKey = fieldMappings[key] || key;
    formData[formKey] = apiData[key];
  });

  return formData;
};

/**
 * Create form data from API response
 * @param {Object} apiData - API response data
 * @param {Object} options - Processing options
 * @returns {Object} Form data object
 */
export const createFormDataFromApi = (apiData, options = {}) => {
  const {
    fieldMappings = {},
    defaultValues = {},
    excludeFields = [],
  } = options;

  let formData = { ...apiData };

  // Apply field mappings
  Object.keys(fieldMappings).forEach((apiField) => {
    const formField = fieldMappings[apiField];
    if (formData[apiField] !== undefined) {
      formData[formField] = formData[apiField];
      delete formData[apiField];
    }
  });

  // Remove excluded fields
  excludeFields.forEach((field) => {
    delete formData[field];
  });

  // Apply default values
  Object.keys(defaultValues).forEach((field) => {
    if (formData[field] === undefined || formData[field] === null) {
      formData[field] = defaultValues[field];
    }
  });

  return formData;
};

/**
 * Deep merge form data objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
export const mergeFormData = (target, source) => {
  const result = { ...target };

  Object.keys(source).forEach((key) => {
    if (source[key] !== undefined && source[key] !== null) {
      result[key] = source[key];
    }
  });

  return result;
};

/**
 * Create form data with conditional fields
 * @param {Object} baseData - Base form data
 * @param {Object} conditions - Conditional field definitions
 * @returns {Object} Form data with conditional fields
 */
export const createConditionalFormData = (baseData, conditions = {}) => {
  const result = { ...baseData };

  Object.keys(conditions).forEach((field) => {
    const condition = conditions[field];
    const { when, then, otherwise } = condition;

    // Evaluate condition
    const conditionMet = typeof when === 'function' ? when(result) : when;

    // Set field value based on condition
    result[field] = conditionMet ? then : otherwise;
  });

  return result;
};
