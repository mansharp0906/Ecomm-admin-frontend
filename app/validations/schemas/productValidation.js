import * as Yup from 'yup';

// Product variant validation schema - Basic validation
export const productVariantSchema = Yup.object({
  name: Yup.string().required('Variant name is required'),

  sku: Yup.string().required('SKU is required'),

  price: Yup.number().required('Price is required'),

  comparePrice: Yup.number().nullable(),

  costPrice: Yup.number().nullable(),

  stock: Yup.number().required('Stock is required'),

  weight: Yup.number().nullable(),

  dimensions: Yup.object({
    length: Yup.number().nullable(),
    width: Yup.number().nullable(),
    height: Yup.number().nullable(),
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

  sku: Yup.string().nullable(),

  barcode: Yup.string().nullable(),

  thumbnail: Yup.string().nullable(),

  images: Yup.array().of(Yup.string()).nullable(),

  brand: Yup.string().nullable(),

  category: Yup.string().required('Category is required'),

  subCategory: Yup.string().nullable(),

  attributes: Yup.array().nullable(),

  type: Yup.string()
    .oneOf(['physical', 'digital'], 'Type must be physical or digital')
    .nullable(),

  unit: Yup.string().nullable(),

  minOrderQty: Yup.number()
    .min(1, 'Minimum order quantity must be at least 1')
    .nullable(),

  tax: Yup.number().min(0, 'Tax cannot be negative').nullable(),

  taxType: Yup.string()
    .oneOf(
      ['inclusive', 'exclusive'],
      'Tax type must be inclusive or exclusive',
    )
    .nullable(),

  shippingCost: Yup.number()
    .min(0, 'Shipping cost cannot be negative')
    .nullable(),

  weight: Yup.number().min(0, 'Weight cannot be negative').nullable(),

  dimensions: Yup.object({
    length: Yup.number().min(0, 'Length cannot be negative').nullable(),
    width: Yup.number().min(0, 'Width cannot be negative').nullable(),
    height: Yup.number().min(0, 'Height cannot be negative').nullable(),
  }).nullable(),

  status: Yup.string()
    .oneOf(
      ['active', 'inactive', 'draft'],
      'Status must be active, inactive, or draft',
    )
    .nullable(),

  featured: Yup.boolean().nullable(),

  metaTitle: Yup.string().nullable(),

  metaDescription: Yup.string().nullable(),

  pdf: Yup.string().nullable(),

  tags: Yup.array().of(Yup.string()).nullable(),

  variants: Yup.array().nullable(),
});

// Product update validation schema - Updated to match payload structure
export const productUpdateSchema = Yup.object({
  id: Yup.string().required('ID is required'),

  title: Yup.string().required('Product title is required'),

  slug: Yup.string().nullable(),

  description: Yup.string().nullable(),

  shortDescription: Yup.string().nullable(),

  sku: Yup.string().nullable(),

  barcode: Yup.string().nullable(),

  thumbnail: Yup.string().nullable(),

  images: Yup.array().of(Yup.string()).nullable(),

  brand: Yup.string().nullable(),

  category: Yup.string().required('Category is required'),

  subCategory: Yup.string().nullable(),

  attributes: Yup.array().nullable(),

  type: Yup.string()
    .oneOf(['physical', 'digital'], 'Type must be physical or digital')
    .nullable(),

  unit: Yup.string().nullable(),

  minOrderQty: Yup.number()
    .min(1, 'Minimum order quantity must be at least 1')
    .nullable(),

  tax: Yup.number().min(0, 'Tax cannot be negative').nullable(),

  taxType: Yup.string()
    .oneOf(
      ['inclusive', 'exclusive'],
      'Tax type must be inclusive or exclusive',
    )
    .nullable(),

  shippingCost: Yup.number()
    .min(0, 'Shipping cost cannot be negative')
    .nullable(),

  weight: Yup.number().min(0, 'Weight cannot be negative').nullable(),

  dimensions: Yup.object({
    length: Yup.number().min(0, 'Length cannot be negative').nullable(),
    width: Yup.number().min(0, 'Width cannot be negative').nullable(),
    height: Yup.number().min(0, 'Height cannot be negative').nullable(),
  }).nullable(),

  status: Yup.string()
    .oneOf(
      ['active', 'inactive', 'draft'],
      'Status must be active, inactive, or draft',
    )
    .nullable(),

  featured: Yup.boolean().nullable(),

  metaTitle: Yup.string().nullable(),

  metaDescription: Yup.string().nullable(),

  pdf: Yup.string().nullable(),

  tags: Yup.array().of(Yup.string()).nullable(),

  variants: Yup.array().nullable(),
});
