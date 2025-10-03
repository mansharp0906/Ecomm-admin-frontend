/* eslint-disable */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import authService from '@/api/service/authService';
import LoadingOverlay from '@/components/Loading/index'; // import it here
import { useValidation, loginSchema } from '@/validations';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Use validation hook
  const { errors, validate, clearErrors, clearFieldError } = useValidation(loginSchema);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear field error when user starts typing (same logic as sub-category form)
    if (errors[name] && value && value.trim() !== '') {
      clearFieldError(name);
    }
    
    // Clear login error when user starts typing
    if (loginError) {
      setLoginError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearErrors();
    setLoginError('');

    try {
      // Validate form data first
      const isValid = await validate(formData);
      if (!isValid) {
        setLoading(false);
        return;
      }

      const response = await authService.login({ 
        email: formData.email, 
        password: formData.password 
      });
      
      if (response?.data?.success) {
        const token = response.data.data?.token;
        if (token) {
          localStorage.setItem('token', token);
          showSuccessToast('Login successful!');
          navigate('/dashboard');
        } else {
          setLoginError('Login response missing token');
          showErrorToast('Login response missing token');
        }
      } else {
        setLoginError('Wrong email or password');
        showErrorToast('Wrong email or password');
      }
    } catch (error) {
      let errorMessage = 'Login failed!';
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        errorMessage = 'Wrong email or password';
      } else if (error.response?.status === 404) {
        errorMessage = 'User not found. Please register first.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Account not verified. Please check your email for verification.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setLoginError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay />}

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Sign In
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={`mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors?.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
              />
              {errors?.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors?.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                }`}
              />
              {errors?.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* API Error Message */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{loginError}</p>
              </div>
            )}

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 text-white rounded-lg transition duration-200 ${
                loading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
