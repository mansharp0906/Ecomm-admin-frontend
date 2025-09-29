import * as Yup from 'yup';

// Sub-Sub-Category create validation schema - Basic validation
export const subSubCategoryCreateSchema = Yup.object({
  name: Yup.string()
    .required('Sub-sub-category name is required'),

  parentId: Yup.string()
    .required('Parent sub-category is required'),

  level: Yup.number()
    .required('Level is required'),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),

  // Optional fields
  description: Yup.string().nullable(),
  slug: Yup.string().nullable(),
  priority: Yup.number().nullable(),
  isFeatured: Yup.boolean().nullable(),
  image: Yup.string().nullable(),
});

// Sub-Sub-Category update validation schema - Basic validation
export const subSubCategoryUpdateSchema = Yup.object({
  id: Yup.string().required('ID is required'),
  name: Yup.string()
    .required('Sub-sub-category name is required'),

  parentId: Yup.string()
    .required('Parent sub-category is required'),

  level: Yup.number()
    .required('Level is required'),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),

  // Optional fields
  description: Yup.string().nullable(),
  slug: Yup.string().nullable(),
  priority: Yup.number().nullable(),
  isFeatured: Yup.boolean().nullable(),
  image: Yup.string().nullable(),
});