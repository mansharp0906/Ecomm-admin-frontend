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

// Product create validation schema - Basic validation
export const productCreateSchema = Yup.object({
  name: Yup.string().required('Product name is required'),

  description: Yup.string().required('Product description is required'),

  category: Yup.string().required('Category is required'),

  brand: Yup.string().required('Brand is required'),

  status: Yup.string()
    .required('Status is required')
    .oneOf(
      ['active', 'inactive', 'draft'],
      'Status must be active, inactive, or draft',
    ),

  variants: Yup.array()
    .of(productVariantSchema)
    .min(1, 'At least one variant is required')
    .required(),

  images: Yup.array().of(Yup.string()).nullable(),

  tags: Yup.array().of(Yup.string()).nullable(),

  isFeatured: Yup.boolean().nullable(),

  isDigital: Yup.boolean().nullable(),

  downloadableFiles: Yup.array().of(Yup.string()).nullable(),

  seoTitle: Yup.string().nullable(),

  seoDescription: Yup.string().nullable(),

  seoKeywords: Yup.string().nullable(),

  metaTitle: Yup.string().nullable(),

  metaDescription: Yup.string().nullable(),
});

// Product update validation schema - Basic validation
export const productUpdateSchema = Yup.object({
  id: Yup.string().required('ID is required'),

  name: Yup.string().required('Product name is required'),

  description: Yup.string().required('Product description is required'),

  category: Yup.string().required('Category is required'),

  brand: Yup.string().required('Brand is required'),

  status: Yup.string()
    .required('Status is required')
    .oneOf(
      ['active', 'inactive', 'draft'],
      'Status must be active, inactive, or draft',
    ),

  variants: Yup.array()
    .of(productVariantSchema)
    .min(1, 'At least one variant is required')
    .required(),

  images: Yup.array().of(Yup.string()).nullable(),

  tags: Yup.array().of(Yup.string()).nullable(),

  isFeatured: Yup.boolean().nullable(),

  isDigital: Yup.boolean().nullable(),

  downloadableFiles: Yup.array().of(Yup.string()).nullable(),

  seoTitle: Yup.string().nullable(),

  seoDescription: Yup.string().nullable(),

  seoKeywords: Yup.string().nullable(),

  metaTitle: Yup.string().nullable(),

  metaDescription: Yup.string().nullable(),
});
