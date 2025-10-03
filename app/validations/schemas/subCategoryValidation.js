import * as Yup from 'yup';

// Sub-Category create validation schema - Basic validation
export const subCategoryCreateSchema = Yup.object({
  name: Yup.string().required('Sub-category name is required'),

  parentId: Yup.string().required('Parent category is required'),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),

  // Required fields
  description: Yup.string().nullable(),

  // Optional fields
  slug: Yup.string().nullable(),
  priority: Yup.number().nullable(),
  isFeatured: Yup.boolean().nullable(),
  image: Yup.string().nullable(),
});

// Sub-Category update validation schema - Basic validation
export const subCategoryUpdateSchema = Yup.object({
  id: Yup.string().required('ID is required'),
  name: Yup.string().required('Sub-category name is required'),

  parentId: Yup.string().required('Parent category is required'),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),

  // Required fields
  description: Yup.string().nullable(),

  // Optional fields
  slug: Yup.string().nullable(),
  priority: Yup.number().nullable(),
  isFeatured: Yup.boolean().nullable(),
  image: Yup.string().nullable(),
});
