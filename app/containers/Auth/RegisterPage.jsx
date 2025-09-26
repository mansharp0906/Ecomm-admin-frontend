import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '@/api/service/authService';
import { showSuccessToast, showErrorToast } from '@/utils/toast'; // 👈 custom toast utils
import LoadingOverlay from '@/components/Loading/index';
import { useValidation, userCreateSchema } from '@/validations';
export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Use validation hook
  const { errors, validate, clearErrors } = useValidation(userCreateSchema);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    clearErrors();

    try {
      // Validate form data
      const isValid = await validate(formData);
      if (!isValid) {
        setLoading(false);
        return;
      }

      await authService.register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      showSuccessToast('Registration successful!');

      // Redirect to login after 1.5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Registration failed');
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
            Create your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleRegister}>
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md sm:text-sm ${
                    errors?.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors?.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md sm:text-sm ${
                    errors?.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors?.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md sm:text-sm ${
                    errors?.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors?.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
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
              </div>

              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md sm:text-sm ${
                    errors?.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors?.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md sm:text-sm ${
                    errors?.role ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                  <option value="customer">Customer</option>
                </select>
                {errors?.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>

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
