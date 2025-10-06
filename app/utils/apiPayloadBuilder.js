/**
 * API Payload Builder Utility
 * Handles FormData and JSON payload creation for API requests
 */

/**
 * Build FormData payload for file uploads
 * @param {Object} formData - Form data object
 * @param {Array} fileFields - Array of file field names
 * @param {Object} options - Additional options
 * @returns {FormData} FormData object
 */
export const buildFormDataPayload = (
  formData,
  fileFields = [],
  options = {},
) => {
  const { customFieldMapping = {} } = options;
  const payload = new FormData();

  // Default file fields
  const defaultFileFields = ['thumbnail', 'images', 'pdf', 'image', 'banner'];
  const allFileFields = [...new Set([...defaultFileFields, ...fileFields])];

  // Add text fields
  Object.keys(formData).forEach((key) => {
    const value = formData[key];

    // Skip file fields and null/undefined values
    if (allFileFields.includes(key) || value === null || value === undefined) {
      return;
    }

    // Handle different data types
    if (typeof value === 'object' && !Array.isArray(value)) {
      // Convert objects to JSON string
      payload.append(key, JSON.stringify(value));
    } else if (Array.isArray(value)) {
      // Special handling for variants array
      if (key === 'variants') {
        const filteredVariants = value
          .filter(
            (variant) => variant && variant.sku && variant.sku.trim() !== '',
          )
          .map((variant) => ({
            ...variant,
            sku: variant.sku.trim(),
          }));
        // Only include variants if there are valid ones, otherwise skip the field
        if (filteredVariants.length > 0) {
          payload.append(key, JSON.stringify(filteredVariants));
        }
        // Don't add variants field if empty
      } else {
        // Handle other arrays
        if (value.length > 0) {
          payload.append(key, JSON.stringify(value));
        } else {
          payload.append(key, JSON.stringify([]));
        }
      }
    } else if (typeof value === 'boolean') {
      // Convert boolean to string
      payload.append(key, String(value));
    } else if (typeof value === 'number') {
      // Convert number to string
      payload.append(key, String(value));
    } else {
      // Special handling for numeric fields that might come as strings
      const numericFields = [
        'tax',
        'shippingCost',
        'minOrderQty',
        'length',
        'width',
        'height',
      ];
      const optionalNumericFields = ['weight']; // Fields that can be omitted if empty

      if (
        numericFields.includes(key) &&
        value !== null &&
        value !== undefined &&
        value !== ''
      ) {
        payload.append(key, String(Number(value) || 0));
      } else if (optionalNumericFields.includes(key)) {
        // Only include weight if it has a valid value
        if (
          value !== null &&
          value !== undefined &&
          value !== '' &&
          value.toString().trim() !== ''
        ) {
          payload.append(key, String(Number(value) || 0));
        }
        // Don't add weight field if empty
      } else {
        // String values
        payload.append(key, String(value || ''));
      }
    }
  });

  // Add file fields
  allFileFields.forEach((field) => {
    const fileValue = formData[field];

    // Map file field names to backend expected names
    let fileFieldName = field;

    // Check for custom field mapping first
    if (customFieldMapping[field]) {
      fileFieldName = customFieldMapping[field];
    } else if (field === 'images') {
      fileFieldName = 'images';
    } else if (field === 'imageFile') {
      fileFieldName = 'image'; // Default to 'image' for categories
    } else if (field === 'bannerFile') {
      fileFieldName = 'banner';
    } else if (field === 'thumbnailFile') {
      fileFieldName = 'thumbnail';
    } else if (field === 'pdfFile') {
      fileFieldName = 'pdf';
    }

    if (fileValue) {
      if (Array.isArray(fileValue)) {
        // Multiple files (like images)
        fileValue.forEach((file) => {
          if (file instanceof File) {
            payload.append(fileFieldName, file);
          }
        });
      } else if (fileValue instanceof File) {
        // Single file
        payload.append(fileFieldName, fileValue);
      }
    }
  });

  // Add custom fields from options
  if (options.customFields) {
    Object.keys(options.customFields).forEach((key) => {
      payload.append(key, options.customFields[key]);
    });
  }

  return payload;
};

/**
 * Build JSON payload for regular API requests
 * @param {Object} formData - Form data object
 * @param {Array} fileFields - Array of file field names to exclude
 * @param {Object} options - Additional options
 * @returns {Object} JSON object
 */
export const buildJsonPayload = (formData, fileFields = [], options = {}) => {
  const payload = {};

  // Default file fields to exclude
  const defaultFileFields = ['thumbnailFile', 'images', 'pdfFile', 'imageFile'];
  const allFileFields = [...new Set([...defaultFileFields, ...fileFields])];

  Object.keys(formData).forEach((key) => {
    const value = formData[key];

    // Skip file fields and null/undefined values
    if (allFileFields.includes(key) || value === null || value === undefined) {
      return;
    }

    // Handle different data types
    if (typeof value === 'object' && !Array.isArray(value)) {
      // Keep objects as is
      payload[key] = value;
    } else if (Array.isArray(value)) {
      // Special handling for variants array
      if (key === 'variants') {
        const filteredVariants = value
          .filter(
            (variant) => variant && variant.sku && variant.sku.trim() !== '',
          )
          .map((variant) => ({
            ...variant,
            sku: variant.sku.trim(),
          }));
        // Only include variants if there are valid ones, otherwise skip the field
        if (filteredVariants.length > 0) {
          payload[key] = filteredVariants;
        }
        // Don't add variants field if empty
      } else {
        // Keep other arrays as is
        payload[key] = value;
      }
    } else if (typeof value === 'boolean') {
      // Convert boolean
      payload[key] = Boolean(value);
    } else if (typeof value === 'number') {
      // Convert number
      payload[key] = Number(value) || 0;
    } else {
      // Special handling for numeric fields that might come as strings
      const numericFields = [
        'tax',
        'shippingCost',
        'minOrderQty',
        'length',
        'width',
        'height',
      ];
      const optionalNumericFields = ['weight']; // Fields that can be omitted if empty

      if (
        numericFields.includes(key) &&
        value !== null &&
        value !== undefined &&
        value !== ''
      ) {
        payload[key] = Number(value) || 0;
      } else if (optionalNumericFields.includes(key)) {
        // Only include weight if it has a valid value
        if (
          value !== null &&
          value !== undefined &&
          value !== '' &&
          value.toString().trim() !== ''
        ) {
          payload[key] = Number(value) || 0;
        }
        // Don't add weight field if empty
      } else {
        // String values
        payload[key] = String(value || '');
      }
    }
  });

  // Add custom fields from options
  if (options.customFields) {
    Object.assign(payload, options.customFields);
  }

  return payload;
};

/**
 * Determine if FormData should be used based on file fields
 * @param {Object} formData - Form data object
 * @param {Array} fileFields - Array of file field names
 * @returns {boolean} True if FormData should be used
 */
export const shouldUseFormData = (formData, fileFields = []) => {
  // Default file fields
  const defaultFileFields = [
    'thumbnailFile',
    'images',
    'pdfFile',
    'imageFile',
    'bannerFile',
  ];
  const allFileFields = [...new Set([...defaultFileFields, ...fileFields])];

  return allFileFields.some((field) => {
    const value = formData[field];
    if (Array.isArray(value)) {
      return value.length > 0 && value.some((item) => item instanceof File);
    }
    return value instanceof File;
  });
};

/**
 * Build API payload (FormData or JSON) based on file presence
 * @param {Object} formData - Form data object
 * @param {Array} fileFields - Array of file field names
 * @param {Object} options - Additional options
 * @returns {FormData|Object} FormData or JSON payload
 */
export const buildApiPayload = (formData, fileFields = [], options = {}) => {
  if (shouldUseFormData(formData, fileFields)) {
    return buildFormDataPayload(formData, fileFields, options);
  } else {
    return buildJsonPayload(formData, fileFields, options);
  }
};

/**
 * Product-specific payload builder
 * @param {Object} formData - Product form data
 * @param {Object} options - Additional options
 * @returns {FormData|Object} API payload
 */
export const buildProductPayload = (formData, options = {}) => {
  const fileFields = ['thumbnailFile', 'images', 'pdfFile'];

  // Product-specific custom fields
  const customFields = {
    createdBy: '651fa9f9eabf0f001fc6a826',
    ...options.customFields,
  };

  return buildApiPayload(formData, fileFields, { ...options, customFields });
};

/**
 * Category-specific payload builder
 * @param {Object} formData - Category form data
 * @param {Object} options - Additional options
 * @returns {FormData|Object} API payload
 */
export const buildCategoryPayload = (formData, options = {}) => {
  const fileFields = ['imageFile', 'image'];
  return buildApiPayload(formData, fileFields, options);
};

/**
 * Brand-specific payload builder
 * @param {Object} formData - Brand form data
 * @param {Object} options - Additional options
 * @returns {FormData|Object} API payload
 */
export const buildBrandPayload = (formData, options = {}) => {
  const fileFields = ['imageFile', 'bannerFile', 'image', 'banner', 'logo'];
  const customFieldMapping = {
    imageFile: 'logo', // Brand backend expects 'logo' not 'image'
  };
  return buildApiPayload(formData, fileFields, {
    ...options,
    customFieldMapping,
  });
};

/**
 * Attribute-specific payload builder
 * @param {Object} formData - Attribute form data
 * @param {Object} options - Additional options
 * @returns {Object} API payload
 */
export const buildAttributePayload = (formData, options = {}) => {
  // Attributes don't have file uploads, so always use JSON payload
  const payload = {};

  // Handle basic fields
  Object.keys(formData).forEach((key) => {
    const value = formData[key];

    // Skip file fields and null/undefined values
    if (value === null || value === undefined) {
      return;
    }

    // Handle different data types
    if (typeof value === 'object' && !Array.isArray(value)) {
      // Keep objects as is
      payload[key] = value;
    } else if (Array.isArray(value)) {
      // Keep arrays as is (for values array)
      payload[key] = value;
    } else if (typeof value === 'boolean') {
      // Convert boolean
      payload[key] = Boolean(value);
    } else if (typeof value === 'number') {
      // Convert number
      payload[key] = Number(value) || 0;
    } else {
      // String values
      payload[key] = String(value || '');
    }
  });

  // Add custom fields from options
  if (options.customFields) {
    Object.assign(payload, options.customFields);
  }

  return payload;
};
