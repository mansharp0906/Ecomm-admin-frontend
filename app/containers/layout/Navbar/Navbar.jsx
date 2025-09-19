import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50  text-white p-4 flex items-center justify-end"
      style={{
        color: '#fff',
        backgroundColor: 'var(--color-primary)',
      }}
    >
      {/* User menu button */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 px-4 py-2 rounded"
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          <span className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
            <FiUser size={24} color="black" />
          </span>

          <svg
            className={`w-4 h-4 transform transition-transform ${
              dropdownOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg z-20">
            <ul>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => alert('Profile clicked')}
                >
                  Profile
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => alert('Settings clicked')}
                >
                  Settings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => alert('Logout clicked')}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
