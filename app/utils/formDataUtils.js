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
 * ✅ Update form data field (Supports deep nested dot notation paths)
 * Example: "contact.email" or "contact.address.city"
 */
export const updateFormDataField = (
  setFormData,
  fieldPath,
  value,
  options = {},
) => {
  const { clearErrors = null, clearRelatedFields = [] } = options;

  setFormData((prevData) => {
    const keys = fieldPath.split('.');
    const updated = { ...prevData };
    let nested = updated;

    // Traverse deep path and clone objects
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      nested[key] = nested[key] ? { ...nested[key] } : {};
      nested = nested[key];
    }

    // Set final value
    nested[keys[keys.length - 1]] = value;

    // Clear related fields if any
    clearRelatedFields.forEach((relatedField) => {
      const relKeys = relatedField.split('.');
      let relNested = updated;
      for (let i = 0; i < relKeys.length - 1; i++) {
        const k = relKeys[i];
        relNested[k] = relNested[k] ? { ...relNested[k] } : {};
        relNested = relNested[k];
      }
      relNested[relKeys[relKeys.length - 1]] = '';
    });

    // Clear errors
    if (clearErrors && typeof clearErrors === 'function') {
      clearErrors(fieldPath);
    }

    return updated;
  });
};

/**
 * ✅ Handle input change event (Supports nested fields)
 */
export const handleInputChange = (
  event,
  setFormData,
  clearErrors,
  options = {},
) => {
  const { name, value, type, checked } = event.target;
  const { clearRelatedFields = [] } = options;

  const actualValue = type === 'checkbox' ? checked : value;

  updateFormDataField(setFormData, name, actualValue, {
    clearErrors,
    clearRelatedFields,
  });

  if (clearErrors && actualValue && actualValue.toString().trim() !== '') {
    clearErrors(name);
  }
};

/**
 * Process form data before API submission
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

  // Apply default values
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
 */
export const validateRequiredFields = (formData, requiredFields = []) => {
  const errors = {};

  requiredFields.forEach((field) => {
    // ✅ Support deep nested field validation
    const keys = field.split('.');
    let value = formData;
    for (const key of keys) {
      if (value == null) break;
      value = value[key];
    }

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
 */
export const mergeFormData = (target, source) => {
  const result = { ...target };

  Object.keys(source).forEach((key) => {
    if (source[key] !== undefined && source[key] !== null) {
      // ✅ If nested object, deep merge
      if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = mergeFormData(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  });

  return result;
};

/**
 * Create form data with conditional fields
 */
export const createConditionalFormData = (baseData, conditions = {}) => {
  const result = { ...baseData };

  Object.keys(conditions).forEach((field) => {
    const condition = conditions[field];
    const { when, then, otherwise } = condition;

    const conditionMet = typeof when === 'function' ? when(result) : when;

    result[field] = conditionMet ? then : otherwise;
  });

  return result;
};
