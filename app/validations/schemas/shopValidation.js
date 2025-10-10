import * as yup from 'yup';

export const shopCreateSchema = yup.object({
  name: yup.string().required('Shop name is required'),
  description: yup.string().nullable(),

  contact: yup
    .object({
      email: yup.string().email('Invalid email').nullable(),
      phone: yup.string().nullable(),
      address: yup
        .object({
          street: yup.string().nullable(),
          city: yup.string().nullable(),
          state: yup.string().nullable(),
          country: yup.string().nullable(),
          zipCode: yup.string().nullable(),
        })
        .required('Address is required'),
    })
    .required(),

  socialMedia: yup
    .object({
      website: yup.string().url('Invalid URL').nullable(),
      facebook: yup.string().url('Invalid URL').nullable(),
      instagram: yup.string().url('Invalid URL').nullable(),
    })
    .required(),

  settings: yup
    .object({
      commissionRate: yup
        .number()
        .min(0)
        .max(100)
        .required('Commission rate is required'),
      autoApproveProducts: yup.boolean().required(),
    })
    .required(),

  logo: yup
    .mixed()
    .test(
      'is-valid-logo',
      'Invalid logo',
      (value) =>
        value === null || typeof value === 'string' || value instanceof File,
    ),

  banner: yup
    .mixed()
    .test(
      'is-valid-banner',
      'Invalid banner',
      (value) =>
        value === null || typeof value === 'string' || value instanceof File,
    ),

  slug: yup.string().nullable(),
});

export const shopUpdateSchema = shopCreateSchema;
