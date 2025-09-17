import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '@/api/service/authService';
import { showSuccessToast, showErrorToast } from '@/utils/toast'; // 👈 custom toast utils

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // 👈 loading state

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true); // start loading

    try {
      await authService.register({
        name,
        email,
        password,
        role,
      });

      showSuccessToast('Registration successful!');

      // Redirect to login after 1.5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      showErrorToast(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
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
                placeholder="Full Name"
                value={name}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Role (admin/member)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md sm:text-sm"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <div>
              <button
                type="submit"
                disabled={loading} // disable while loading
                className={`w-full py-2 px-4 text-white rounded-md ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
