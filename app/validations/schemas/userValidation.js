import * as Yup from 'yup';

// User create validation schema - Minimal validation (email + password only)
export const userCreateSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),

  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),

  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

// User update validation schema - Minimal validation (email + password only)
export const userUpdateSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),

  // Password is optional for updates
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .nullable(),

  confirmPassword: Yup.string().when('password', {
    is: (password) => password && password.length > 0,
    then: (schema) =>
      schema.oneOf([Yup.ref('password')], 'Passwords must match'),
    otherwise: (schema) => schema.nullable(),
  }),
});

// Login validation schema - Minimal validation (email + password only)
export const loginSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),

  password: Yup.string().required('Password is required'),
});

// Password reset validation schema - Minimal validation (email only)
export const passwordResetSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
});

// Change password validation schema - Minimal validation (passwords only)
export const changePasswordSchema = Yup.object({
  newPassword: Yup.string()
    .required('New password is required')
    .min(6, 'New password must be at least 6 characters'),

  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});
