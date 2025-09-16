import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.currentPassword)
      newErrors.currentPassword = 'Current password is required';
    if (!formData.newPassword)
      newErrors.newPassword = 'New password is required';
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // submit payload
      // { currentPassword: 'OldPass123', newPassword: 'NewPass456' }
      console.log({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      alert('Password reset request submitted');
    }
  };
  return (
    <div
      className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{ backgroundColor: 'white' }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 bg-indigo-600 rounded-full"></div>
            <div className="w-6 h-6 bg-indigo-600 rounded-full -ml-2"></div>
          </div>
        </div>
        <h2
          className="mt-6 text-center text-3xl font-bold text-gray-900"
          style={{ color: '#111827' }}
        >
          Reset your password
        </h2>
        <p
          className="mt-2 text-center text-sm text-gray-600"
          style={{ color: '#6b7280' }}
        >
          Enter your email and set a new password. Passwords must match.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
          style={{ backgroundColor: 'white' }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Current Password"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{
                  border: errors.currentPassword
                    ? '1px solid #ef4444'
                    : '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#111827',
                  backgroundColor: 'white',
                }}
              />
              {errors.currentPassword && (
                <p
                  className="mt-1 text-sm text-red-600"
                  style={{ color: '#dc2626' }}
                >
                  {errors.currentPassword}
                </p>
              )}
            </div>

            <div>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="New Password"
                value={formData.newPassword}
                onChange={handleChange}
                className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{
                  border: errors.newPassword
                    ? '1px solid #ef4444'
                    : '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#111827',
                  backgroundColor: 'white',
                }}
              />
              {errors.newPassword && (
                <p
                  className="mt-1 text-sm text-red-600"
                  style={{ color: '#dc2626' }}
                >
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{
                  border: errors.confirmPassword
                    ? '1px solid #ef4444'
                    : '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#111827',
                  backgroundColor: 'white',
                }}
              />
              {errors.confirmPassword && (
                <p
                  className="mt-1 text-sm text-red-600"
                  style={{ color: '#dc2626' }}
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                style={{
                  backgroundColor: '#4f46e5',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  width: '100%',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Update password
              </button>
            </div>
          </form>

          <div className="mt-6">
            <p
              className="text-center text-sm text-gray-600"
              style={{ color: '#6b7280' }}
            >
              Remember your password?{' '}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
                style={{ color: '#4f46e5' }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
