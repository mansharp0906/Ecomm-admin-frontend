import * as Yup from 'yup';

// Sub-Sub-Category create validation schema
export const subSubCategoryCreateSchema = Yup.object({
  name: Yup.string()
    .required('Sub-sub-category name is required')
    .min(2, 'Sub-sub-category name must be at least 2 characters')
    .max(50, 'Sub-sub-category name must not exceed 50 characters')
    .test(
      'name-format',
      'Name can only contain letters, numbers, spaces, hyphens, and underscores',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[a-zA-Z0-9\s\-_]+$/.test(value);
      },
    ),

  parentId: Yup.string()
    .required('Parent sub-category is required')
    .test(
      'parent-exists',
      'Please select a valid parent sub-category',
      function (value) {
        if (!value) return false;
        return value.length > 0;
      },
    ),

  level: Yup.number()
    .integer('Level must be a whole number')
    .min(2, 'Level must be at least 2')
    .max(10, 'Level must not exceed 10')
    .required('Level is required'),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),

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
    .integer('Priority must be a whole number')
    .min(0, 'Priority must be positive')
    .nullable(),

  isFeatured: Yup.boolean().nullable(),

  image: Yup.string().url('Please enter a valid URL').nullable(),

  metaTitle: Yup.string()
    .max(60, 'Meta title must not exceed 60 characters')
    .nullable(),

  metaDescription: Yup.string()
    .max(160, 'Meta description must not exceed 160 characters')
    .nullable(),

  // SEO fields
  seoTitle: Yup.string()
    .max(60, 'SEO title must not exceed 60 characters')
    .nullable(),

  seoDescription: Yup.string()
    .max(160, 'SEO description must not exceed 160 characters')
    .nullable(),

  seoKeywords: Yup.string()
    .max(200, 'SEO keywords must not exceed 200 characters')
    .nullable(),

  // Additional fields for sub-sub-category
  tags: Yup.array()
    .of(Yup.string())
    .max(10, 'Maximum 10 tags allowed')
    .nullable(),

  sortOrder: Yup.number()
    .integer('Sort order must be a whole number')
    .min(0, 'Sort order must be positive')
    .nullable(),
});

// Sub-Sub-Category update validation schema
export const subSubCategoryUpdateSchema = Yup.object({
  id: Yup.string().required('ID is required'),
  name: Yup.string()
    .required('Sub-sub-category name is required')
    .min(2, 'Sub-sub-category name must be at least 2 characters')
    .max(50, 'Sub-sub-category name must not exceed 50 characters')
    .test(
      'name-format',
      'Name can only contain letters, numbers, spaces, hyphens, and underscores',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[a-zA-Z0-9\s\-_]+$/.test(value);
      },
    ),

  parentId: Yup.string()
    .required('Parent sub-category is required')
    .test(
      'parent-exists',
      'Please select a valid parent sub-category',
      function (value) {
        if (!value) return false;
        return value.length > 0;
      },
    ),

  level: Yup.number()
    .integer('Level must be a whole number')
    .min(2, 'Level must be at least 2')
    .max(10, 'Level must not exceed 10')
    .required('Level is required'),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),

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
    .integer('Priority must be a whole number')
    .min(0, 'Priority must be positive')
    .nullable(),

  isFeatured: Yup.boolean().nullable(),

  image: Yup.string().url('Please enter a valid URL').nullable(),

  metaTitle: Yup.string()
    .max(60, 'Meta title must not exceed 60 characters')
    .nullable(),

  metaDescription: Yup.string()
    .max(160, 'Meta description must not exceed 160 characters')
    .nullable(),

  // SEO fields
  seoTitle: Yup.string()
    .max(60, 'SEO title must not exceed 60 characters')
    .nullable(),

  seoDescription: Yup.string()
    .max(160, 'SEO description must not exceed 160 characters')
    .nullable(),

  seoKeywords: Yup.string()
    .max(200, 'SEO keywords must not exceed 200 characters')
    .nullable(),

  // Additional fields for sub-sub-category
  tags: Yup.array()
    .of(Yup.string())
    .max(10, 'Maximum 10 tags allowed')
    .nullable(),

  sortOrder: Yup.number()
    .integer('Sort order must be a whole number')
    .min(0, 'Sort order must be positive')
    .nullable(),
});
