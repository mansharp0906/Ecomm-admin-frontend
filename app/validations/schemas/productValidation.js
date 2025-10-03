import * as Yup from 'yup';

// Product variant validation schema - Basic validation
export const productVariantSchema = Yup.object({
  name: Yup.string().required('Variant name is required'),

  sku: Yup.string().required('SKU is required'),

  price: Yup.number().required('Price is required'),

  comparePrice: Yup.number().nullable(),

  costPrice: Yup.number().nullable(),

  stock: Yup.number().required('Stock is required'),

  weight: Yup.number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    }),

  dimensions: Yup.object({
    length: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value;
      }),
    width: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value;
      }),
    height: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value;
      }),
  }).nullable(),

  attributes: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required(),
        value: Yup.string().required(),
      }),
    )
    .nullable(),

  images: Yup.array().of(Yup.string()).nullable(),
});

// Product create validation schema - Updated to match payload structure
export const productCreateSchema = Yup.object({
  title: Yup.string().required('Product title is required'),

  slug: Yup.string().nullable(),

  description: Yup.string().nullable(),

  shortDescription: Yup.string().nullable(),

  sku: Yup.string().when('variants', {
    is: (variants) => !variants || variants.length === 0,
    then: (schema) => schema.required('SKU is required when no variants exist'),
    otherwise: (schema) => schema.nullable(),
  }),

  barcode: Yup.string().nullable(),

  thumbnail: Yup.string().required('Thumbnail image is required'),

  images: Yup.array().of(Yup.string()).nullable(),

  brand: Yup.string().required('Brand is required'),

  category: Yup.string().required('Category is required'),

  subCategory: Yup.string().required('Sub Category is required'),

  attributes: Yup.array().nullable(),

  type: Yup.string().nullable(),

  unit: Yup.string().nullable(),

  minOrderQty: Yup.number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    }),

  tax: Yup.number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    }),

  taxType: Yup.string().nullable(),

  shippingCost: Yup.number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    }),

  weight: Yup.number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    }),

  dimensions: Yup.object({
    length: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value;
      }),
    width: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value;
      }),
    height: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value;
      }),
  }).nullable(),

  status: Yup.string().nullable(),

  featured: Yup.boolean().nullable(),

  metaTitle: Yup.string().nullable(),

  metaDescription: Yup.string().nullable(),

  pdf: Yup.string().nullable(),

  tags: Yup.mixed()
    .nullable()
    .transform((value, originalValue) => {
      if (
        originalValue === '' ||
        originalValue === null ||
        originalValue === undefined
      ) {
        return null;
      }
      if (typeof originalValue === 'string') {
        return originalValue
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag !== '');
      }
      return value;
    }),

  variants: Yup.array().nullable(),
});

// Product update validation schema - Updated to match payload structure
export const productUpdateSchema = Yup.object({
  id: Yup.string().required('ID is required'),

  title: Yup.string().required('Product title is required'),

  slug: Yup.string().nullable(),

  description: Yup.string().nullable(),

  shortDescription: Yup.string().nullable(),

  sku: Yup.string().when('variants', {
    is: (variants) => !variants || variants.length === 0,
    then: (schema) => schema.required('SKU is required when no variants exist'),
    otherwise: (schema) => schema.nullable(),
  }),

  barcode: Yup.string().nullable(),

  thumbnail: Yup.string().required('Thumbnail image is required'),

  images: Yup.array().of(Yup.string()).nullable(),

  brand: Yup.string().required('Brand is required'),

  category: Yup.string().required('Category is required'),

  subCategory: Yup.string().required('Sub Category is required'),

  attributes: Yup.array().nullable(),

  type: Yup.string().nullable(),

  unit: Yup.string().nullable(),

  minOrderQty: Yup.number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    }),

  tax: Yup.number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    }),

  taxType: Yup.string().nullable(),

  shippingCost: Yup.number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    }),

  weight: Yup.number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    }),

  dimensions: Yup.object({
    length: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value;
      }),
    width: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value;
      }),
    height: Yup.number()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === '' ? null : value;
      }),
  }).nullable(),

  status: Yup.string().nullable(),

  featured: Yup.boolean().nullable(),

  metaTitle: Yup.string().nullable(),

  metaDescription: Yup.string().nullable(),

  pdf: Yup.string().nullable(),

  tags: Yup.mixed()
    .nullable()
    .transform((value, originalValue) => {
      if (
        originalValue === '' ||
        originalValue === null ||
        originalValue === undefined
      ) {
        return null;
      }
      if (typeof originalValue === 'string') {
        return originalValue
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag !== '');
      }
      return value;
    }),

  variants: Yup.array().nullable(),
});
