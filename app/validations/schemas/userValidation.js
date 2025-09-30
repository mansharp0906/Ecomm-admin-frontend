import * as Yup from 'yup';

// User create validation schema - Complete validation for registration
export const userCreateSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),

  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),

  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),

  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    ),

  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),

  role: Yup.string()
    .required('Role is required')
    .oneOf(
      ['admin', 'manager', 'cashier', 'customer', 'vendor', 'delivery'],
      'Invalid role selected',
    ),
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
    .min(6, 'New password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'New password must contain at least one lowercase letter, one uppercase letter, and one number',
    ),

  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});
