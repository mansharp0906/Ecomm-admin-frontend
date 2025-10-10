import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '@/api/service/authService';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import LoadingOverlay from '@/components/Loading/index';
// You should create a vendor schema with these fields for your useValidation import!
import { vendorValidation ,useValidation} from '@/validations';
import { ScrollContainer } from '@/components';

export default function VendorRegistered() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'vendor',
    vendorProfile: {
      businessName: '',
      taxNumber: '',
      bankDetails: {
        accountName: '',
        accountNumber: '',
        bankName: '',
        ifscCode: '',
      },
    },
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // validation hook - update your schema for these fields!
  const { errors, validate, clearErrors } = useValidation(vendorValidation);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Handle nested vendorProfile and bankDetails
    if (name.startsWith('vendorProfile.bankDetails.')) {
      const key = name.split('.').pop();
      setFormData((prev) => ({
        ...prev,
        vendorProfile: {
          ...prev.vendorProfile,
          bankDetails: {
            ...prev.vendorProfile.bankDetails,
            [key]: value,
          },
        },
      }));
    } else if (name.startsWith('vendorProfile.')) {
      const key = name.split('.').pop();
      setFormData((prev) => ({
        ...prev,
        vendorProfile: { ...prev.vendorProfile, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    clearErrors();

    try {
      // Validate formData
      const isValid = await validate(formData);
      if (!isValid) {
        setLoading(false);
        showErrorToast('Please fix all validation errors before submitting');
        return;
      }

      await authService.register(formData);

      showSuccessToast('Registration successful!');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || ' vendor Registration failed';
      showErrorToast(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay />}
      <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="flex items-center space-x-1">
              <div className="w-6 h-6 bg-indigo-600 rounded-full"></div>
              <div className="w-6 h-6 bg-indigo-600 rounded-full -ml-2"></div>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Vendor Registration
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <ScrollContainer>
              <form className="space-y-6" onSubmit={handleRegister}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md sm:text-sm ${
                    errors?.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors?.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md sm:text-sm ${
                    errors?.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors?.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md sm:text-sm ${
                    errors?.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors?.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}

                <input
                  type="text"
                  name="phone"
                  placeholder="Phone (e.g. +919876543211)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md sm:text-sm ${
                    errors?.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors?.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}

                <hr />
                <input
                  type="text"
                  name="vendorProfile.businessName"
                  placeholder="Business Name"
                  value={formData.vendorProfile.businessName}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md sm:text-sm ${
                    errors?.['vendorProfile.businessName']
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {errors?.['vendorProfile.businessName'] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors['vendorProfile.businessName']}
                  </p>
                )}

                <input
                  type="text"
                  name="vendorProfile.taxNumber"
                  placeholder="GSTIN / Tax Number"
                  value={formData.vendorProfile.taxNumber}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md sm:text-sm ${
                    errors?.['vendorProfile.taxNumber']
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {errors?.['vendorProfile.taxNumber'] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors['vendorProfile.taxNumber']}
                  </p>
                )}

                <hr />
                <input
                  type="text"
                  name="vendorProfile.bankDetails.accountName"
                  placeholder="Bank Account Name"
                  value={formData.vendorProfile.bankDetails.accountName}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md sm:text-sm ${
                    errors?.['vendorProfile.bankDetails.accountName']
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {errors?.['vendorProfile.bankDetails.accountName'] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors['vendorProfile.bankDetails.accountName']}
                  </p>
                )}

                <input
                  type="text"
                  name="vendorProfile.bankDetails.accountNumber"
                  placeholder="Bank Account Number"
                  value={formData.vendorProfile.bankDetails.accountNumber}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md sm:text-sm ${
                    errors?.['vendorProfile.bankDetails.accountNumber']
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {errors?.['vendorProfile.bankDetails.accountNumber'] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors['vendorProfile.bankDetails.accountNumber']}
                  </p>
                )}

                <input
                  type="text"
                  name="vendorProfile.bankDetails.bankName"
                  placeholder="Bank Name"
                  value={formData.vendorProfile.bankDetails.bankName}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md sm:text-sm ${
                    errors?.['vendorProfile.bankDetails.bankName']
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {errors?.['vendorProfile.bankDetails.bankName'] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors['vendorProfile.bankDetails.bankName']}
                  </p>
                )}

                <input
                  type="text"
                  name="vendorProfile.bankDetails.ifscCode"
                  placeholder="IFSC Code"
                  value={formData.vendorProfile.bankDetails.ifscCode}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md sm:text-sm ${
                    errors?.['vendorProfile.bankDetails.ifscCode']
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {errors?.['vendorProfile.bankDetails.ifscCode'] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors['vendorProfile.bankDetails.ifscCode']}
                  </p>
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 text-white rounded-md ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                  >
                    Create account
                  </button>
                </div>
              </form>
            </ScrollContainer>
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
