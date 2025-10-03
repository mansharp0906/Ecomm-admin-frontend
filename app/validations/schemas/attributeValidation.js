import * as Yup from 'yup';

// Attribute value validation schema - Basic validation
export const attributeValueSchema = Yup.object({
  value: Yup.string().required('Value is required'),

  color: Yup.string().nullable(),

  image: Yup.string().nullable(),

  isDefault: Yup.boolean().required(),
});

// Attribute create validation schema - Basic validation
export const attributeCreateSchema = Yup.object({
  name: Yup.string().required('Attribute name is required'),

  displayType: Yup.string()
    .oneOf(['color', 'text', 'image'], 'Invalid display type')
    .nullable(),

  isFilterable: Yup.boolean().nullable(),

  isRequired: Yup.boolean().nullable(),

  status: Yup.string()
    .oneOf(['active', 'inactive'], 'Status must be active or inactive')
    .nullable(),

  parentId: Yup.string().required('Category is required'),

  description: Yup.string().nullable(),

  values: Yup.array().of(attributeValueSchema).nullable(),

  priority: Yup.number().nullable(),

  isFeatured: Yup.boolean().nullable(),
});

// Attribute update validation schema - Basic validation
export const attributeUpdateSchema = Yup.object({
  id: Yup.string().required('ID is required'),

  name: Yup.string().required('Attribute name is required'),

  displayType: Yup.string()
    .oneOf(['color', 'text', 'image'], 'Invalid display type')
    .nullable(),

  isFilterable: Yup.boolean().nullable(),

  isRequired: Yup.boolean().nullable(),

  status: Yup.string()
    .oneOf(['active', 'inactive'], 'Status must be active or inactive')
    .nullable(),

  parentId: Yup.string().required('Category is required'),

  description: Yup.string().nullable(),

  values: Yup.array().of(attributeValueSchema).nullable(),

  priority: Yup.number().nullable(),

  isFeatured: Yup.boolean().nullable(),
});
