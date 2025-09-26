import * as Yup from 'yup';

// Attribute value validation schema
export const attributeValueSchema = Yup.object({
  value: Yup.string()
    .required('Value is required')
    .min(1, 'Value must be at least 1 character')
    .max(100, 'Value must not exceed 100 characters'),
  color: Yup.string().when('$displayType', {
    is: 'color',
    then: (schema) => schema.required('Color is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  image: Yup.string()
    .url('Please enter a valid URL')
    .when('$displayType', {
      is: 'image',
      then: (schema) => schema.required('Image URL is required'),
      otherwise: (schema) => schema.notRequired().nullable(),
    }),
  isDefault: Yup.boolean().required(),
});

// Attribute create validation schema
export const attributeCreateSchema = Yup.object({
  name: Yup.string()
    .required('Attribute name is required')
    .min(2, 'Attribute name must be at least 2 characters')
    .max(50, 'Attribute name must not exceed 50 characters')
    .test(
      'name-format',
      'Name can only contain letters, numbers, spaces, hyphens, and underscores',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[a-zA-Z0-9\s\-_]+$/.test(value);
      },
    ),

  displayType: Yup.string()
    .required('Display type is required')
    .oneOf(['color', 'text', 'image'], 'Invalid display type'),

  isFilterable: Yup.boolean().required(),
  isRequired: Yup.boolean().required(),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),

  parentId: Yup.string().trim().required('Category is required'),

  values: Yup.array()
    .of(attributeValueSchema)
    .min(1, 'Please add at least 1 value')
    .required('Values are required'),

  // Optional fields
  description: Yup.string()
    .max(500, 'Description must not exceed 500 characters')
    .nullable(),

  slug: Yup.string()
    .test(
      'slug-format',
      'Slug can only contain lowercase letters, numbers, and hyphens',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
      },
    )
    .nullable(),

  priority: Yup.number()
    .integer('Value must be a whole number')
    .min(0, 'Value must be positive')
    .nullable(),

  level: Yup.number()
    .integer('Value must be a whole number')
    .min(0, 'Value must be positive')
    .nullable(),

  isFeatured: Yup.boolean().nullable(),

  image: Yup.string().url('Please enter a valid URL').nullable(),

  metaTitle: Yup.string()
    .max(60, 'Meta title must not exceed 60 characters')
    .nullable(),

  metaDescription: Yup.string()
    .max(160, 'Meta description must not exceed 160 characters')
    .nullable(),
});

// Attribute update validation schema
export const attributeUpdateSchema = Yup.object({
  id: Yup.string().required('ID is required'),
  name: Yup.string()
    .required('Attribute name is required')
    .min(2, 'Attribute name must be at least 2 characters')
    .max(50, 'Attribute name must not exceed 50 characters')
    .test(
      'name-format',
      'Name can only contain letters, numbers, spaces, hyphens, and underscores',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[a-zA-Z0-9\s\-_]+$/.test(value);
      },
    ),

  displayType: Yup.string()
    .required('Display type is required')
    .oneOf(['color', 'text', 'image'], 'Invalid display type'),

  isFilterable: Yup.boolean().required(),
  isRequired: Yup.boolean().required(),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),

  parentId: Yup.string().trim().required('Category is required'),

  values: Yup.array()
    .of(attributeValueSchema)
    .min(1, 'Please add at least 1 value')
    .required('Values are required'),

  // Optional fields
  description: Yup.string()
    .max(500, 'Description must not exceed 500 characters')
    .nullable(),

  slug: Yup.string()
    .test(
      'slug-format',
      'Slug can only contain lowercase letters, numbers, and hyphens',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
      },
    )
    .nullable(),

  priority: Yup.number()
    .integer('Value must be a whole number')
    .min(0, 'Value must be positive')
    .nullable(),

  level: Yup.number()
    .integer('Value must be a whole number')
    .min(0, 'Value must be positive')
    .nullable(),

  isFeatured: Yup.boolean().nullable(),

  image: Yup.string().url('Please enter a valid URL').nullable(),

  metaTitle: Yup.string()
    .max(60, 'Meta title must not exceed 60 characters')
    .nullable(),

  metaDescription: Yup.string()
    .max(160, 'Meta description must not exceed 160 characters')
    .nullable(),
});
