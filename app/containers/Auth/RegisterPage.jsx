import React from 'react';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
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
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
          style={{ backgroundColor: 'white' }}
        >
          <form className="space-y-6">
            <div>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Full Name"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#111827',
                  backgroundColor: 'white',
                }}
              />
            </div>

            <div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#111827',
                  backgroundColor: 'white',
                }}
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#111827',
                  backgroundColor: 'white',
                }}
              />
            </div>
            <div>
              <input
                id="role"
                name="role"
                type="role"
                placeholder="role"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  color: '#111827',
                  backgroundColor: 'white',
                }}
              />
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
                Create account
              </button>
            </div>
          </form>

          <div className="mt-6">
            <p
              className="text-center text-sm text-gray-600"
              style={{ color: '#6b7280' }}
            >
              Already have an account?{' '}
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
