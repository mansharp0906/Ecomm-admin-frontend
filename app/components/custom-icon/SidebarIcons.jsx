import React from 'react';

export const DashboardIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="min-w-[32px] min-h-[32px]"
  >
    <rect x="14" y="34" width="8" height="16" fill="#facc15" rx="2" />
    <rect x="26" y="26" width="8" height="24" fill="#10b981" rx="2" />
    <rect x="38" y="18" width="8" height="32" fill="#3b82f6" rx="2" />
    <rect x="50" y="10" width="8" height="40" fill="#ef4444" rx="2" />
  </svg>
);

export const ProductIcon = () => (
<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth="2"
  width="24"
  height="20"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M3 3h2l.4 2M7 13h10l4-8H5.4"
  />
  <circle cx="7" cy="21" r="2" />
  <circle cx="17" cy="21" r="2" />
</svg>
);

export const OrderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="28"
    height="24"
  >
    <rect
      x="12"
      y="8"
      width="40"
      height="48"
      rx="4"
      fill="#fef3c7"
      stroke="#facc15"
      strokeWidth="2"
    />
    <rect x="18" y="14" width="28" height="4" rx="2" fill="#4f46e5" />
    <rect x="18" y="22" width="20" height="3" rx="1.5" fill="#10b981" />
    <rect x="18" y="28" width="24" height="3" rx="1.5" fill="#3b82f6" />
    <rect x="18" y="34" width="16" height="3" rx="1.5" fill="#ef4444" />
    <rect x="18" y="42" width="28" height="4" rx="2" fill="#f59e0b" />
  </svg>
);

export const ProductManagementIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="28"
    height="24"
  >
    <path d="M8 24L32 8L56 24V48L32 56L8 48V24Z" fill="#facc15" />
    <path d="M8 24L32 32L56 24L32 16L8 24Z" fill="#4f46e5" />
    <path d="M32 32V56L56 48V24L32 32Z" fill="#10b981" />
    <path d="M32 32V56L8 48V24L32 32Z" fill="#ef4444" />
  </svg>
);

export const PromotionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="28"
    height="24"
  >
    <path d="M8 24L40 16V48L8 40V24Z" fill="#4f46e5" />
    <path
      d="M44 20C48 24 48 40 44 44"
      stroke="#facc15"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <rect x="16" y="44" width="8" height="12" rx="2" fill="#10b981" />
    <circle cx="32" cy="32" r="4" fill="#ef4444" />
  </svg>
);

export const ReportsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="30"
    height="30"
  >
    <circle cx="32" cy="20" r="10" fill="#10b981" />
    <path d="M12 48c0-8 9-14 20-14s20 6 20 14" fill="#facc15" />
  </svg>
);

export const UserManagementIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="36"
    height="36"
  >
    <circle cx="32" cy="32" r="32" fill="#ffff" />
    <circle cx="32" cy="22" r="8" fill="#facc15" />
    <path d="M18 44c0-6 6-10 14-10s14 4 14 10" fill="#10b981" />
    <circle cx="22" cy="26" r="4" fill="#3b82f6" />
    <circle cx="42" cy="26" r="4" fill="#ef4444" />
  </svg>
);

export const BusinessSettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width="28"
    height="28"
  >
    <rect x="12" y="16" width="28" height="32" rx="4" fill="#3b82f6" />
    <rect x="18" y="22" width="6" height="6" fill="#fef3c7" />
    <rect x="18" y="32" width="6" height="6" fill="#fef3c7" />
    <rect x="26" y="22" width="6" height="6" fill="#fef3c7" />
    <rect x="26" y="32" width="6" height="6" fill="#fef3c7" />
    <circle cx="48" cy="48" r="6" fill="#10b981" />
    <path
      d="M48 42v2M48 54v2M42 48h2M54 48h2M44.2 44.2l1.4 1.4M51.4 51.4l1.4 1.4M44.2 51.8l1.4-1.4M51.4 44.6l1.4-1.4"
      stroke="#facc15"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const SystemSettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="20"
    fill="#3b82f6"
  >
    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
    <path d="M19.4 12.9c.1-.3.1-.6.1-.9s0-.6-.1-.9l2.1-1.6c.2-.2.3-.5.2-.8l-2-3.5c-.1-.3-.4-.4-.7-.3l-2.5 1c-.5-.4-1-.7-1.6-.9l-.4-2.7C14.5 2.2 14.3 2 14 2h-4c-.3 0-.5.2-.5.5l-.4 2.7c-.6.2-1.1.5-1.6.9l-2.5-1c-.3-.1-.6 0-.7.3l-2 3.5c-.1.3 0 .6.2.8l2.1 1.6c-.1.3-.1.6-.1.9s0 .6.1.9l-2.1 1.6c-.2.2-.3.5-.2.8l2 3.5c.1.3.4.4.7.3l2.5-1c.5.4 1 .7 1.6.9l.4 2.7c0 .3.2.5.5.5h4c.3 0 .5-.2.5-.5l.4-2.7c.6-.2 1.1-.5 1.6-.9l2.5 1c.3.1.6 0 .7-.3l2-3.5c.1-.3 0-.6-.2-.8l-2.1-1.6z" />
  </svg>
);
