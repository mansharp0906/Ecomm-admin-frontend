import * as Yup from 'yup';

// Brand create validation schema - Basic validation
export const brandCreateSchema = Yup.object({
  name: Yup.string().required('Brand name is required'),

  description: Yup.string().nullable(),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),

  logo: Yup.string().nullable(),

  banner: Yup.string().nullable(),

  website: Yup.string().nullable(),

  email: Yup.string().nullable(),

  phone: Yup.string().nullable(),

  address: Yup.string().nullable(),

  country: Yup.string().nullable(),

  city: Yup.string().nullable(),

  zipCode: Yup.string().nullable(),

  isFeatured: Yup.boolean().nullable(),

  priority: Yup.number().nullable(),

  image: Yup.string().nullable(),

  metaTitle: Yup.string().nullable(),

  metaDescription: Yup.string().nullable(),

  metaKeywords: Yup.string().nullable(),
});

// Brand update validation schema - Basic validation
export const brandUpdateSchema = Yup.object({
  id: Yup.string().required('ID is required'),

  name: Yup.string().required('Brand name is required'),

  description: Yup.string().nullable(),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),

  logo: Yup.string().nullable(),

  banner: Yup.string().nullable(),

  website: Yup.string().nullable(),

  email: Yup.string().nullable(),

  phone: Yup.string().nullable(),

  address: Yup.string().nullable(),

  country: Yup.string().nullable(),

  city: Yup.string().nullable(),

  zipCode: Yup.string().nullable(),

  isFeatured: Yup.boolean().nullable(),

  priority: Yup.number().nullable(),

  image: Yup.string().nullable(),

  metaTitle: Yup.string().nullable(),

  metaDescription: Yup.string().nullable(),

  metaKeywords: Yup.string().nullable(),
});
