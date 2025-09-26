import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * Custom hook for form validation using Yup schemas
 * @param {Object} schema - Yup validation schema
 * @param {Object} options - Additional options for validation
 * @returns {Object} - Validation state and methods
 */
export const useValidation = (schema, options = {}) => {
  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  const {
    showToast = true,
    abortEarly = false,
    stripUnknown = true,
    context = {},
  } = options;

  /**
   * Validate form data against schema
   * @param {Object} data - Data to validate
   * @param {Object} validationContext - Additional context for validation
   * @returns {Promise<boolean>} - Whether validation passed
   */
  const validate = useCallback(
    async (data, validationContext = {}) => {
      try {
        setIsValidating(true);
        setErrors({});

        const mergedContext = { ...context, ...validationContext };

        await schema.validate(data, {
          abortEarly,
          stripUnknown,
          context: mergedContext,
        });

        return true;
      } catch (error) {
        const validationErrors = {};

        if (error.inner && error.inner.length > 0) {
          // Multiple validation errors
          error.inner.forEach((err) => {
            if (err.path) {
              validationErrors[err.path] = err.message;
            }
          });
        } else if (error.path) {
          // Single validation error
          validationErrors[error.path] = error.message;
        } else {
          // Generic error
          validationErrors.general = error.message || 'Validation failed';
        }

        setErrors(validationErrors);

        if (showToast) {
          toast.error('Please fix the validation errors');
        }

        return false;
      } finally {
        setIsValidating(false);
      }
    },
    [schema, abortEarly, stripUnknown, context, showToast],
  );

  /**
   * Validate a single field
   * @param {string} field - Field name to validate
   * @param {any} value - Field value to validate
   * @param {Object} data - Complete form data
   * @returns {Promise<boolean>} - Whether field validation passed
   */
  const validateField = useCallback(
    async (field, value, data = {}) => {
      try {
        const fieldSchema = schema.fields[field];
        if (!fieldSchema) return true;

        await fieldSchema.validate(value, {
          context: { ...context, ...data },
        });

        // Clear field error if validation passes
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });

        return true;
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.message,
        }));
        return false;
      }
    },
    [schema, context],
  );

  /**
   * Clear all validation errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Clear error for specific field
   * @param {string} field - Field name to clear error for
   */
  const clearFieldError = useCallback((field) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * Set custom error for field
   * @param {string} field - Field name
   * @param {string} message - Error message
   */
  const setFieldError = useCallback((field, message) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  }, []);

  /**
   * Check if form has any errors
   * @returns {boolean} - Whether form has errors
   */
  const hasErrors = useCallback(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  /**
   * Get error message for specific field
   * @param {string} field - Field name
   * @returns {string|undefined} - Error message or undefined
   */
  const getFieldError = useCallback(
    (field) => {
      return errors[field];
    },
    [errors],
  );

  return {
    errors,
    isValidating,
    validate,
    validateField,
    clearErrors,
    clearFieldError,
    setFieldError,
    hasErrors,
    getFieldError,
    setErrors,
  };
};
