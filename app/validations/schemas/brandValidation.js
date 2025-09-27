import * as Yup from 'yup';

// Brand create validation schema
export const brandCreateSchema = Yup.object({
  name: Yup.string()
    .required('Brand name is required')
    .min(2, 'Brand name must be at least 2 characters')
    .max(50, 'Brand name must not exceed 50 characters')
    .test(
      'name-format',
      'Name can only contain letters, numbers, spaces, hyphens, and underscores',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[a-zA-Z0-9\s\-_]+$/.test(value);
      },
    ),

  description: Yup.string()
    .max(500, 'Description must not exceed 500 characters')
    .nullable(),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),

  logo: Yup.string()
    .test(
      'is-url-or-file-ref',
      'Please enter a valid URL or upload a file',
      function (value) {
        if (!value) return true; // Allow empty values
        // Check if it's a valid URL or blob URL
        return /^(https?:\/\/|blob:)/.test(value);
      },
    )
    .nullable(),

  banner: Yup.string()
    .test(
      'is-url-or-file-ref',
      'Please enter a valid URL or upload a file',
      function (value) {
        if (!value) return true; // Allow empty values
        // Check if it's a valid URL or blob URL
        return /^(https?:\/\/|blob:)/.test(value);
      },
    )
    .nullable(),

  website: Yup.string().url('Please enter a valid URL').nullable(),

  email: Yup.string().email('Please enter a valid email address').nullable(),

  phone: Yup.string()
    .test(
      'phone-format',
      'Please enter a valid phone number',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[+]?[1-9][\d]{0,15}$/.test(value);
      },
    )
    .nullable(),

  address: Yup.string()
    .max(200, 'Address must not exceed 200 characters')
    .nullable(),

  country: Yup.string()
    .max(50, 'Country must not exceed 50 characters')
    .nullable(),

  city: Yup.string().max(50, 'City must not exceed 50 characters').nullable(),

  zipCode: Yup.string()
    .max(10, 'ZIP code must not exceed 10 characters')
    .nullable(),

  isFeatured: Yup.boolean().nullable(),

  priority: Yup.number()
    .integer('Value must be a whole number')
    .min(0, 'Value must be positive')
    .nullable(),

  // Logo and Banner fields
  image: Yup.string()
    .test(
      'is-url-or-file-ref',
      'Please enter a valid URL or upload a file',
      function (value) {
        if (!value) return true; // Allow empty values
        // Check if it's a valid URL or blob URL
        return /^(https?:\/\/|blob:)/.test(value);
      },
    )
    .nullable(),

  // SEO fields
  metaTitle: Yup.string()
    .max(60, 'Meta title must not exceed 60 characters')
    .nullable(),

  metaDescription: Yup.string()
    .max(160, 'Meta description must not exceed 160 characters')
    .nullable(),

  metaKeywords: Yup.string()
    .max(200, 'Meta keywords must not exceed 200 characters')
    .nullable(),
});

// Brand update validation schema
export const brandUpdateSchema = Yup.object({
  id: Yup.string().required('ID is required'),
  name: Yup.string()
    .required('Brand name is required')
    .min(2, 'Brand name must be at least 2 characters')
    .max(50, 'Brand name must not exceed 50 characters')
    .test(
      'name-format',
      'Name can only contain letters, numbers, spaces, hyphens, and underscores',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[a-zA-Z0-9\s\-_]+$/.test(value);
      },
    ),

  description: Yup.string()
    .max(500, 'Description must not exceed 500 characters')
    .nullable(),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),

  logo: Yup.string()
    .test(
      'is-url-or-file-ref',
      'Please enter a valid URL or upload a file',
      function (value) {
        if (!value) return true; // Allow empty values
        // Check if it's a valid URL or blob URL
        return /^(https?:\/\/|blob:)/.test(value);
      },
    )
    .nullable(),

  banner: Yup.string()
    .test(
      'is-url-or-file-ref',
      'Please enter a valid URL or upload a file',
      function (value) {
        if (!value) return true; // Allow empty values
        // Check if it's a valid URL or blob URL
        return /^(https?:\/\/|blob:)/.test(value);
      },
    )
    .nullable(),

  website: Yup.string().url('Please enter a valid URL').nullable(),

  email: Yup.string().email('Please enter a valid email address').nullable(),

  phone: Yup.string()
    .test(
      'phone-format',
      'Please enter a valid phone number',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[+]?[1-9][\d]{0,15}$/.test(value);
      },
    )
    .nullable(),

  address: Yup.string()
    .max(200, 'Address must not exceed 200 characters')
    .nullable(),

  country: Yup.string()
    .max(50, 'Country must not exceed 50 characters')
    .nullable(),

  city: Yup.string().max(50, 'City must not exceed 50 characters').nullable(),

  zipCode: Yup.string()
    .max(10, 'ZIP code must not exceed 10 characters')
    .nullable(),

  isFeatured: Yup.boolean().nullable(),

  priority: Yup.number()
    .integer('Value must be a whole number')
    .min(0, 'Value must be positive')
    .nullable(),

  // Logo and Banner fields
  image: Yup.string()
    .test(
      'is-url-or-file-ref',
      'Please enter a valid URL or upload a file',
      function (value) {
        if (!value) return true; // Allow empty values
        // Check if it's a valid URL or blob URL
        return /^(https?:\/\/|blob:)/.test(value);
      },
    )
    .nullable(),

  // SEO fields
  metaTitle: Yup.string()
    .max(60, 'Meta title must not exceed 60 characters')
    .nullable(),

  metaDescription: Yup.string()
    .max(160, 'Meta description must not exceed 160 characters')
    .nullable(),

  metaKeywords: Yup.string()
    .max(200, 'Meta keywords must not exceed 200 characters')
    .nullable(),
});
