/**
 * Utility Functions Index
 * Centralized exports for all utility functions
 */

// API Payload Builder
export {
  buildFormDataPayload,
  buildJsonPayload,
  shouldUseFormData,
  buildApiPayload,
  buildProductPayload,
  buildCategoryPayload,
  buildBrandPayload,
  buildAttributePayload,
} from './apiPayloadBuilder';

// File Upload Handler
export {
  handleFileUpload,
  handleMultipleFileUpload,
  removeFileFromUpload,
  clearAllFiles,
  handleFileInputChange,
  validateFileType,
  validateFileSize,
  validateFile,
} from './fileUploadHandler';

// Form Data Utils
export {
  createDefaultFormData,
  resetFormData,
  updateFormDataField,
  handleInputChange,
  processFormData,
  validateRequiredFields,
  convertToApiFormat,
  convertFromApiFormat,
  createFormDataFromApi,
  mergeFormData,
  createConditionalFormData,
} from './formDataUtils';

// Date Utils
export {
  formatDateShort,
  formatDateLong,
  formatDateOnly,
  formatDateTime,
  getRelativeTime,
  isValidDate,
  getCurrentDateISO,
  formatDateForAPI,
  getDateRange,
} from './dateUtils';
