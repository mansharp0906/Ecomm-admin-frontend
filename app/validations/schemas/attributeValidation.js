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
    .required('Display type is required')
    .oneOf(['color', 'text', 'image'], 'Invalid display type'),

  isFilterable: Yup.boolean().required(),

  isRequired: Yup.boolean().required(),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),

  parentId: Yup.string().required('Category is required'),

  description: Yup.string().nullable(),

  values: Yup.array()
    .of(attributeValueSchema)
    .min(1, 'At least one value is required')
    .nullable(),

  priority: Yup.number().nullable(),

  isFeatured: Yup.boolean().nullable(),
});

// Attribute update validation schema - Basic validation
export const attributeUpdateSchema = Yup.object({
  id: Yup.string().required('ID is required'),

  name: Yup.string().required('Attribute name is required'),

  displayType: Yup.string()
    .required('Display type is required')
    .oneOf(['color', 'text', 'image'], 'Invalid display type'),

  isFilterable: Yup.boolean().required(),

  isRequired: Yup.boolean().required(),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive'], 'Status must be active or inactive'),

  parentId: Yup.string().required('Category is required'),

  description: Yup.string().nullable(),

  values: Yup.array()
    .of(attributeValueSchema)
    .min(1, 'At least one value is required')
    .nullable(),

  priority: Yup.number().nullable(),

  isFeatured: Yup.boolean().nullable(),
});
