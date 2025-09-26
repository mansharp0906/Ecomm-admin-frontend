import * as Yup from 'yup';

// User create validation schema
export const userCreateSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .test(
      'firstName-format',
      'First name can only contain letters and spaces',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[a-zA-Z\s]+$/.test(value);
      },
    ),

  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .test(
      'lastName-format',
      'Last name can only contain letters and spaces',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[a-zA-Z\s]+$/.test(value);
      },
    ),

  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),

  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .test(
      'password-format',
      'Password must contain at least 8 characters with uppercase, lowercase, number and special character',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
          value,
        );
      },
    ),

  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password')], 'Passwords must match'),

  phone: Yup.string()
    .test(
      'phone-format',
      'Please enter a valid phone number',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[+]?[1-9][\d]{0,15}$/.test(value);
      },
    )
    .nullable(),

  role: Yup.string()
    .required('Role is required')
    .oneOf(['admin', 'manager', 'employee', 'customer'], 'Invalid role'),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive', 'pending'], 'Please select a valid status'),

  dateOfBirth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .nullable(),

  gender: Yup.string()
    .oneOf(['male', 'female', 'other'], 'Invalid gender')
    .nullable(),

  address: Yup.object({
    street: Yup.string()
      .max(100, 'Street must not exceed 100 characters')
      .nullable(),
    city: Yup.string().max(50, 'City must not exceed 50 characters').nullable(),
    state: Yup.string()
      .max(50, 'State must not exceed 50 characters')
      .nullable(),
    zipCode: Yup.string()
      .max(10, 'ZIP code must not exceed 10 characters')
      .nullable(),
    country: Yup.string()
      .max(50, 'Country must not exceed 50 characters')
      .nullable(),
  }).nullable(),

  avatar: Yup.string().url('Please enter a valid URL').nullable(),

  isEmailVerified: Yup.boolean().nullable(),
  isPhoneVerified: Yup.boolean().nullable(),

  // Additional fields
  department: Yup.string()
    .max(50, 'Department must not exceed 50 characters')
    .nullable(),

  position: Yup.string()
    .max(50, 'Position must not exceed 50 characters')
    .nullable(),

  employeeId: Yup.string()
    .max(20, 'Employee ID must not exceed 20 characters')
    .nullable(),

  hireDate: Yup.date()
    .max(new Date(), 'Hire date cannot be in the future')
    .nullable(),

  salary: Yup.number().min(0, 'Value must be positive').nullable(),

  // Preferences
  preferences: Yup.object({
    language: Yup.string()
      .max(10, 'Language must not exceed 10 characters')
      .nullable(),
    timezone: Yup.string()
      .max(50, 'Timezone must not exceed 50 characters')
      .nullable(),
    theme: Yup.string().oneOf(['light', 'dark', 'auto']).nullable(),
    notifications: Yup.object({
      email: Yup.boolean().nullable(),
      sms: Yup.boolean().nullable(),
      push: Yup.boolean().nullable(),
    }).nullable(),
  }).nullable(),
});

// User update validation schema
export const userUpdateSchema = Yup.object({
  id: Yup.string().required('ID is required'),
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .test(
      'firstName-format',
      'First name can only contain letters and spaces',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[a-zA-Z\s]+$/.test(value);
      },
    ),

  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .test(
      'lastName-format',
      'Last name can only contain letters and spaces',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[a-zA-Z\s]+$/.test(value);
      },
    ),

  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),

  // Password is optional for updates
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .test(
      'password-format',
      'Password must contain at least 8 characters with uppercase, lowercase, number and special character',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
          value,
        );
      },
    )
    .nullable(),

  confirmPassword: Yup.string()
    .when('password', {
      is: (password) => password && password.length > 0,
      then: (schema) => schema.required('Confirm password is required'),
      otherwise: (schema) => schema.nullable(),
    })
    .oneOf([Yup.ref('password')], 'Passwords must match'),

  phone: Yup.string()
    .test(
      'phone-format',
      'Please enter a valid phone number',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^[+]?[1-9][\d]{0,15}$/.test(value);
      },
    )
    .nullable(),

  role: Yup.string()
    .required('Role is required')
    .oneOf(['admin', 'manager', 'employee', 'customer'], 'Invalid role'),

  status: Yup.string()
    .required('Status is required')
    .oneOf(['active', 'inactive', 'pending'], 'Please select a valid status'),

  dateOfBirth: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .nullable(),

  gender: Yup.string()
    .oneOf(['male', 'female', 'other'], 'Invalid gender')
    .nullable(),

  address: Yup.object({
    street: Yup.string()
      .max(100, 'Street must not exceed 100 characters')
      .nullable(),
    city: Yup.string().max(50, 'City must not exceed 50 characters').nullable(),
    state: Yup.string()
      .max(50, 'State must not exceed 50 characters')
      .nullable(),
    zipCode: Yup.string()
      .max(10, 'ZIP code must not exceed 10 characters')
      .nullable(),
    country: Yup.string()
      .max(50, 'Country must not exceed 50 characters')
      .nullable(),
  }).nullable(),

  avatar: Yup.string().url('Please enter a valid URL').nullable(),

  isEmailVerified: Yup.boolean().nullable(),
  isPhoneVerified: Yup.boolean().nullable(),

  // Additional fields
  department: Yup.string()
    .max(50, 'Department must not exceed 50 characters')
    .nullable(),

  position: Yup.string()
    .max(50, 'Position must not exceed 50 characters')
    .nullable(),

  employeeId: Yup.string()
    .max(20, 'Employee ID must not exceed 20 characters')
    .nullable(),

  hireDate: Yup.date()
    .max(new Date(), 'Hire date cannot be in the future')
    .nullable(),

  salary: Yup.number().min(0, 'Value must be positive').nullable(),

  // Preferences
  preferences: Yup.object({
    language: Yup.string()
      .max(10, 'Language must not exceed 10 characters')
      .nullable(),
    timezone: Yup.string()
      .max(50, 'Timezone must not exceed 50 characters')
      .nullable(),
    theme: Yup.string().oneOf(['light', 'dark', 'auto']).nullable(),
    notifications: Yup.object({
      email: Yup.boolean().nullable(),
      sms: Yup.boolean().nullable(),
      push: Yup.boolean().nullable(),
    }).nullable(),
  }).nullable(),
});

// Login validation schema
export const loginSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),

  password: Yup.string()
    .required('Password is required')
    .min(1, 'Password is required'),

  rememberMe: Yup.boolean().nullable(),
});

// Password reset validation schema
export const passwordResetSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
});

// Change password validation schema
export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),

  newPassword: Yup.string()
    .required('New password is required')
    .min(8, 'New password must be at least 8 characters')
    .test(
      'password-format',
      'Password must contain at least 8 characters with uppercase, lowercase, number and special character',
      function (value) {
        if (!value) return true; // Let required handle empty values
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
          value,
        );
      },
    ),

  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});
