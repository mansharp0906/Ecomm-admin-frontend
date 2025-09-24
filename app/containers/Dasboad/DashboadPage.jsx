import React from 'react';
import Container from '@/components/custom-pages/Container';
import { Button } from '@/components/custom-button';
import { MdAdd } from 'react-icons/md';
import DashAdminWallet from './DashAdminWallet';
const stats = [
  {
    label: 'Total Orders',
    value: 191,
    icon: (
      <svg
        className="w-5 h-5 text-blue-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 3h2l.4 2M7 13h10l4-8H5.4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
      </svg>
    ),
  },
  {
    label: 'Total Stores',
    value: 10,
    icon: (
      <svg
        className="w-5 h-5 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M4 7h16l-1.5 9h-13L4 7zM2 7h20M6 16v4h12v-4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Total Products',
    value: 402,
    icon: (
      <svg
        className="w-5 h-5 text-purple-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 7l9 5 9-5M3 17l9 5 9-5M3 7v10M21 7v10"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Total Customers',
    value: 7,
    icon: (
      <svg
        className="w-5 h-5 text-pink-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const orderStatus = [
  {
    label: 'Pending',
    value: 59,
    icon: (
      <svg
        className="w-4 h-4 text-yellow-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 8v4l3 2"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Confirmed',
    value: 21,
    icon: (
      <svg
        className="w-4 h-4 text-green-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M5 13l4 4L19 7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Packaging',
    value: 9,
    icon: (
      <svg
        className="w-4 h-4 text-indigo-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 7l9 5 9-5M3 17l9 5 9-5M3 7v10M21 7v10"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Out for Delivery',
    value: 8,
    icon: (
      <svg
        className="w-4 h-4 text-blue-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 3h18v13H3zM3 16h18v5H3z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Delivered',
    value: 76,
    icon: (
      <svg
        className="w-4 h-4 text-green-700"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M9 11l3 3L22 4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Canceled',
    value: 9,
    icon: (
      <svg
        className="w-4 h-4 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M6 18L18 6M6 6l12 12"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Returned',
    value: 4,
    icon: (
      <svg
        className="w-4 h-4 text-pink-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M3 10l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V10z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Failed to Deliver',
    value: 5,
    icon: (
      <svg
        className="w-4 h-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];
function DashboardPage() {
  return (
    <>
      <div className="flex justify-between items-center mb-3 ">
        <h3 className="text-lg font-semibold text-gray-800">
          Business Analysis
        </h3>
        <Button
          variant="secondary"
          className="flex items-center space-x-2 px-4 py-2 rounded border border-gray-300"
        >
          <MdAdd className="text-xl" />
          <span>Overall statistics</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 ">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white shadow rounded-lg p-4 relative hover:shadow-md transition-shadow font-bold"
          >
            <div className="absolute top-3 right-3 bg-gray-100 p-2 rounded-full">
              {stat.icon}
            </div>
            <div className="flex flex-col items-start justify-center text-left space-y-1 p-3">
              <p className="text-md text-gray-500 ">{stat.label}</p>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Order Status
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3">
          {orderStatus.map((status) => (
            <div
              key={status.label}
              className="bg-gray-50 rounded-md p-3 text-left border relative"
            >
              <div className="absolute top-3 right-2 bg-gray-100 p-2 rounded-full shadow-sm">
                {status.icon}
              </div>
              <p className="text-sm text-gray-600 font-bold ">{status.label}</p>
              <p className="text-lg font-bold text-blue-600">{status.value}</p>
            </div>
          ))}
        </div>
      </div>
      <DashAdminWallet />
    </>
  );
}

export default DashboardPage;
