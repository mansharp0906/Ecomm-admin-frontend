import * as Yup from 'yup';

// Category create validation schema
export const categoryCreateSchema = Yup.object({
  name: Yup.string()
    .required('Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must not exceed 50 characters')
    .test(
      'name-format',
      'Name can only contain letters, numbers, spaces, hyphens, and underscores',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[a-zA-Z0-9\s\-_]+$/.test(value);
      },
    ),

  // slug: Yup.string()
  //   .required('Slug is required')
  //   .test(
  //     'slug-format',
  //     'Slug can only contain lowercase letters, numbers, and hyphens',
  //     function (value) {
  //       if (!value) return true; // Let required handle empty values
  //       return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
  //     },
  //   ),

  description: Yup.string()
    .required('Description is required')
    .max(500, 'Description must not exceed 500 characters')
    .nullable(),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),

  parentId: Yup.string().nullable(),

  level: Yup.number()
    .integer('Value must be a whole number')
    .min(0, 'Value must be positive')
    .required('Level is required'),

  image: Yup.string().url('Please enter a valid URL').nullable(),

  icon: Yup.string().max(50, 'Icon must not exceed 50 characters').nullable(),

  color: Yup.string()
    .test(
      'color-format',
      'Color must be a valid hex color code',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^#[0-9A-F]{6}$/i.test(value);
      },
    )
    .nullable(),

  isFeatured: Yup.boolean().nullable(),

  priority: Yup.number()
    .integer('Value must be a whole number')
    .min(0, 'Value must be positive')
    .nullable(),

  // SEO fields
  metaTitle: Yup.string()
    .required('Meta title is required')
    .max(60, 'Meta title must not exceed 60 characters')
    .nullable(),

  metaDescription: Yup.string()
    .required('Meta description is required')
    .max(160, 'Meta description must not exceed 160 characters')
    .nullable(),

  metaKeywords: Yup.string()
    .max(200, 'Meta keywords must not exceed 200 characters')
    .nullable(),

  // Additional fields
  showInMenu: Yup.boolean().nullable(),
  showInHome: Yup.boolean().nullable(),
  isActive: Yup.boolean().nullable(),
});

// Category update validation schema
export const categoryUpdateSchema = Yup.object({
  id: Yup.string().required('ID is required'),
  name: Yup.string()
    .required('Category name is required')
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must not exceed 50 characters')
    .test(
      'name-format',
      'Name can only contain letters, numbers, spaces, hyphens, and underscores',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[a-zA-Z0-9\s\-_]+$/.test(value);
      },
    ),

  slug: Yup.string()
    .required('Slug is required')
    .test(
      'slug-format',
      'Slug can only contain lowercase letters, numbers, and hyphens',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
      },
    ),

  description: Yup.string()
    .max(500, 'Description must not exceed 500 characters')
    .nullable(),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),

  parentId: Yup.string().nullable(),

  level: Yup.number()
    .integer('Value must be a whole number')
    .min(0, 'Value must be positive')
    .required('Level is required'),

  image: Yup.string().url('Please enter a valid URL').nullable(),

  icon: Yup.string().max(50, 'Icon must not exceed 50 characters').nullable(),

  color: Yup.string()
    .test(
      'color-format',
      'Color must be a valid hex color code',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^#[0-9A-F]{6}$/i.test(value);
      },
    )
    .nullable(),

  isFeatured: Yup.boolean().nullable(),

  priority: Yup.number()
    .integer('Value must be a whole number')
    .min(0, 'Value must be positive')
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

  // Additional fields
  showInMenu: Yup.boolean().nullable(),
  showInHome: Yup.boolean().nullable(),
  isActive: Yup.boolean().nullable(),
});
