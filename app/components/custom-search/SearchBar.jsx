// SearchBar.jsx
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/components/custom-button';

const SearchBar = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onClear,
  loading = false,
  size = 'md',
  className = '',
  disabled = false,
  debounceMs = 300,
  showClearButton = true,
  showSearchIcon = true,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange && internalValue !== value) {
        onChange(internalValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, onChange, debounceMs, value]);

  // Sync with external value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleInputChange = (e) => {
    setInternalValue(e.target.value);
  };

  const handleClear = useCallback(() => {
    setInternalValue('');
    if (onChange) onChange('');
    if (onClear) onClear();
  }, [onChange, onClear]);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          relative flex items-center border rounded-lg transition-all duration-200
          ${
            isFocused
              ? 'ring-2 ring-blue-500 border-blue-500'
              : 'border-gray-300'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
      >
        {/* Search Icon */}
        {showSearchIcon && (
          <div className="flex-shrink-0 ml-3 mr-2 text-gray-400">
            {loading ? (
              <div
                className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${iconSizes[size]}`}
              ></div>
            ) : (
              <svg
                className={iconSizes[size]}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>
        )}

        {/* Input Field */}
        <input
          type="text"
          value={internalValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`flex-1 bg-transparent border-none outline-none placeholder-gray-400 ${
            disabled ? 'cursor-not-allowed' : 'cursor-text'
          } ${sizeClasses[size]}`}
        />

        {/* Clear Button */}
        {showClearButton && internalValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute right-2 text-gray-400 hover:text-gray-600`}
          >
            &#x2715;
          </button>
        )}
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  loading: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  debounceMs: PropTypes.number,
  showClearButton: PropTypes.bool,
  showSearchIcon: PropTypes.bool,
};

export default SearchBar;
