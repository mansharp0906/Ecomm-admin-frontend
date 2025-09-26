import * as Yup from 'yup';

// Product variant validation schema
export const productVariantSchema = Yup.object({
  name: Yup.string()
    .required('Variant name is required')
    .max(100, 'Variant name must not exceed 100 characters'),

  sku: Yup.string()
    .required('SKU is required')
    .max(50, 'SKU must not exceed 50 characters'),

  price: Yup.number()
    .required('Price is required')
    .min(0, 'Value must be positive')
    .test(
      'price-format',
      'Price must have maximum 2 decimal places',
      (value) =>
        value === undefined ||
        value === null ||
        /^\d+(\.\d{1,2})?$/.test(value.toString()),
    ),

  comparePrice: Yup.number().min(0, 'Value must be positive').nullable(),

  costPrice: Yup.number().min(0, 'Value must be positive').nullable(),

  stock: Yup.number()
    .integer('Value must be a whole number')
    .min(0, 'Value must be positive')
    .required('Stock is required'),

  weight: Yup.number().min(0, 'Value must be positive').nullable(),

  dimensions: Yup.object({
    length: Yup.number().min(0, 'Value must be positive').nullable(),
    width: Yup.number().min(0, 'Value must be positive').nullable(),
    height: Yup.number().min(0, 'Value must be positive').nullable(),
  }).nullable(),

  attributes: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required(),
        value: Yup.string().required(),
      }),
    )
    .nullable(),

  images: Yup.array()
    .of(Yup.string().url('Please enter a valid URL'))
    .nullable(),

  isDefault: Yup.boolean().nullable(),
});

// Product create validation schema
export const productCreateSchema = Yup.object({
  name: Yup.string()
    .required('Product name is required')
    .min(2, 'Product name must be at least 2 characters')
    .max(50, 'Product name must not exceed 50 characters')
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
    .required('Description is required')
    .max(2000, 'Description must not exceed 2000 characters'),

  shortDescription: Yup.string()
    .max(500, 'Short description must not exceed 500 characters')
    .nullable(),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive', 'draft'], 'Please select a valid status'),

  categoryId: Yup.string().required('Category is required'),

  brandId: Yup.string().nullable(),

  tags: Yup.array()
    .of(Yup.string().max(50, 'Tag must not exceed 50 characters'))
    .nullable(),

  // Pricing
  basePrice: Yup.number()
    .required('Base price is required')
    .min(0, 'Value must be positive')
    .test(
      'price-format',
      'Price must have maximum 2 decimal places',
      (value) =>
        value === undefined ||
        value === null ||
        /^\d+(\.\d{1,2})?$/.test(value.toString()),
    ),

  comparePrice: Yup.number().min(0, 'Value must be positive').nullable(),

  costPrice: Yup.number().min(0, 'Value must be positive').nullable(),

  // Inventory
  trackQuantity: Yup.boolean().required(),
  quantity: Yup.number()
    .when('trackQuantity', {
      is: true,
      then: (schema) => schema.required('Quantity is required'),
      otherwise: (schema) => schema.nullable(),
    })
    .integer('Value must be a whole number')
    .min(0, 'Value must be positive'),

  lowStockThreshold: Yup.number()
    .integer('Value must be a whole number')
    .min(0, 'Value must be positive')
    .nullable(),

  // Physical properties
  weight: Yup.number().min(0, 'Value must be positive').nullable(),

  dimensions: Yup.object({
    length: Yup.number().min(0, 'Value must be positive').nullable(),
    width: Yup.number().min(0, 'Value must be positive').nullable(),
    height: Yup.number().min(0, 'Value must be positive').nullable(),
  }).nullable(),

  // Media
  images: Yup.array()
    .of(Yup.string().url('Please enter a valid URL'))
    .min(1, 'Please add at least 1 image')
    .required('Images are required'),

  featuredImage: Yup.string()
    .url('Please enter a valid URL')
    .required('Featured image is required'),

  // Variants
  variants: Yup.array().of(productVariantSchema).nullable(),

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
  isFeatured: Yup.boolean().nullable(),
  isDigital: Yup.boolean().nullable(),
  requiresShipping: Yup.boolean().nullable(),
  taxable: Yup.boolean().nullable(),

  // Shipping
  shippingClass: Yup.string()
    .max(50, 'Shipping class must not exceed 50 characters')
    .nullable(),

  // Attributes
  attributes: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required(),
        value: Yup.string().required(),
      }),
    )
    .nullable(),
});

// Product update validation schema
export const productUpdateSchema = Yup.object({
  id: Yup.string().required('ID is required'),
  name: Yup.string()
    .required('Product name is required')
    .min(2, 'Product name must be at least 2 characters')
    .max(50, 'Product name must not exceed 50 characters')
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
    .required('Description is required')
    .max(2000, 'Description must not exceed 2000 characters'),

  shortDescription: Yup.string()
    .max(500, 'Short description must not exceed 500 characters')
    .nullable(),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive', 'draft'], 'Please select a valid status'),

  categoryId: Yup.string().required('Category is required'),

  brandId: Yup.string().nullable(),

  tags: Yup.array()
    .of(Yup.string().max(50, 'Tag must not exceed 50 characters'))
    .nullable(),

  // Pricing
  basePrice: Yup.number()
    .required('Base price is required')
    .min(0, 'Value must be positive')
    .test(
      'price-format',
      'Price must have maximum 2 decimal places',
      (value) =>
        value === undefined ||
        value === null ||
        /^\d+(\.\d{1,2})?$/.test(value.toString()),
    ),

  comparePrice: Yup.number().min(0, 'Value must be positive').nullable(),

  costPrice: Yup.number().min(0, 'Value must be positive').nullable(),

  // Inventory
  trackQuantity: Yup.boolean().required(),
  quantity: Yup.number()
    .when('trackQuantity', {
      is: true,
      then: (schema) => schema.required('Quantity is required'),
      otherwise: (schema) => schema.nullable(),
    })
    .integer('Value must be a whole number')
    .min(0, 'Value must be positive'),

  lowStockThreshold: Yup.number()
    .integer('Value must be a whole number')
    .min(0, 'Value must be positive')
    .nullable(),

  // Physical properties
  weight: Yup.number().min(0, 'Value must be positive').nullable(),

  dimensions: Yup.object({
    length: Yup.number().min(0, 'Value must be positive').nullable(),
    width: Yup.number().min(0, 'Value must be positive').nullable(),
    height: Yup.number().min(0, 'Value must be positive').nullable(),
  }).nullable(),

  // Media
  images: Yup.array()
    .of(Yup.string().url('Please enter a valid URL'))
    .min(1, 'Please add at least 1 image')
    .required('Images are required'),

  featuredImage: Yup.string()
    .url('Please enter a valid URL')
    .required('Featured image is required'),

  // Variants
  variants: Yup.array().of(productVariantSchema).nullable(),

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
  isFeatured: Yup.boolean().nullable(),
  isDigital: Yup.boolean().nullable(),
  requiresShipping: Yup.boolean().nullable(),
  taxable: Yup.boolean().nullable(),

  // Shipping
  shippingClass: Yup.string()
    .max(50, 'Shipping class must not exceed 50 characters')
    .nullable(),

  // Attributes
  attributes: Yup.array()
    .of(
      Yup.object({
        name: Yup.string().required(),
        value: Yup.string().required(),
      }),
    )
    .nullable(),
});
