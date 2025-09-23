import React, { useState, useEffect, useRef } from 'react';
import { FiUser } from 'react-icons/fi';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  // Function to reset auto-close timer
  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 5000); // 5 seconds inactivity closes dropdown
  };

  // When dropdown opens, start timer
  useEffect(() => {
    if (dropdownOpen) {
      resetTimer();
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }

    // Cleanup on unmount
    return () => clearTimeout(timeoutRef.current);
  }, [dropdownOpen]);

  // User activity inside dropdown resets timer
  const handleUserActivity = () => {
    if (dropdownOpen) {
      resetTimer();
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [dropdownOpen]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 text-black bg-white flex items-center justify-between px-6 h-16"
    >
      {/* Logo and Title */}
      <div className="flex items-center gap-2 text-2xl font-bold text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61l1.38-7.39H6" />
        </svg>
        ShopEase
      </div>

      {/* User Menu */}
      <div
        className="relative"
        ref={dropdownRef}
        onMouseMove={handleUserActivity}
        onKeyDown={handleUserActivity}
      >
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 px-4 py-2 rounded bg-white text-black"
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          <FiUser size={24} />
          <svg
            className={`w-4 h-4 transform transition-transform duration-300 ${
              dropdownOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {dropdownOpen && (
          <div
            className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg z-20"
            onMouseMove={handleUserActivity}
            onKeyDown={handleUserActivity}
            tabIndex={0}
          >
            <ul>
              <li>
                <button
                  onClick={() => alert('Profile clicked')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Settings clicked')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Settings
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert('Logout clicked')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
