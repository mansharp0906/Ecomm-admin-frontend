import * as Yup from 'yup';

export const vendorValidation = Yup.object({
  name: Yup.string()
    .required('Full name is required')
    .min(2, 'Name is too short')
    .max(100, 'Name is too long'),
  email: Yup.string()
    .email('Must be a valid email')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain lowercase, uppercase, and number',
    ),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^\+?\d{10,15}$/, 'Phone number is invalid'),
  role: Yup.string().required('Role is required').oneOf(['vendor']),
  vendorProfile: Yup.object({
    businessName: Yup.string().required('Business name is required'),
    taxNumber: Yup.string().required('Tax number is required'),
    bankDetails: Yup.object({
      accountName: Yup.string().required('Account name is required'),
      accountNumber: Yup.string()
        .required('Account number is required')
        .matches(/^\d+$/, 'Account number must be digits'),
      bankName: Yup.string().required('Bank name is required'),
      ifscCode: Yup.string()
        .required('IFSC code is required')
        .matches(/^[A-Z]{4}\d{7}$/, 'IFSC code format is invalid'),
    }).required(),
  }).required(),
});

// {
//   "name": "Fashion House Styles",
//   "email": "fashion.house@example.com",
//   "password": "Fashion123!",
//   "phone": "+919876543211",
//   "role": "vendor",
//   "vendorProfile": {
//     "businessName": "Fashion House Styles",
//     "taxNumber": "GSTIN987654321",
//     "bankDetails": {
//       "accountName": "Fashion House",
//       "accountNumber": "987654321098",
//       "bankName": "HDFC Bank",
//       "ifscCode": "HDFC0000567"
//     }
//   }
// }
