import * as Yup from 'yup';

// Simple validation schema - no async validation
export const categoryCreateSchema = Yup.object({
  name: Yup.string().required('Category name is required'),
  description: Yup.string().required('Description is required').nullable(),
  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),
  level: Yup.number().nullable(), // Made optional since backend sets it automatically
  image: Yup.string().nullable(),
  icon: Yup.string().nullable(),
  color: Yup.string().nullable(),
  isFeatured: Yup.boolean().nullable(),
  priority: Yup.number().nullable(),
  slug: Yup.string().nullable(),
});

// Simple validation schema for update - no async validation
export const categoryUpdateSchema = Yup.object({
  id: Yup.string().required('ID is required'),
  name: Yup.string().required('Category name is required'),
  description: Yup.string().required('Description is required').nullable(),
  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),
  level: Yup.number().nullable(), // Made optional since backend sets it automatically
  image: Yup.string().nullable(),
  icon: Yup.string().nullable(),
  color: Yup.string().nullable(),
  isFeatured: Yup.boolean().nullable(),
  priority: Yup.number().nullable(),
  slug: Yup.string().nullable(),
});
