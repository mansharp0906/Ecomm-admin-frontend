import { Button, ScrollContainer } from '@/components';
import {
  OrdersIcon,
  StoresIcon,
  ProductsIcon,
  CustomersIcon,
  Pending,
  Confirmed,
  Packaging,
  OutforDelivery,
  Delivered,
  Canceled,
  Returned,
  FailedtoDeliver,
} from '@/components/custom-icon/dashbordIcons.';
import React from 'react';

import { MdAdd } from 'react-icons/md';
import DashAdminWallet from './DashAdminWallet';
const status = [
  { label: 'Total Orders', value: 191, icon: <OrdersIcon /> },
  { label: 'Total Stores', value: 10, icon: <StoresIcon /> },
  { label: 'Total Products', value: 402, icon: <ProductsIcon /> },
  { label: 'Total Customers', value: 7, icon: <CustomersIcon /> },
];
const orderStatus = [
  {
    label: 'Pending',
    value: 59,
    icon: <Pending />,
  },
  {
    label: 'Confirmed',
    value: 21,
    icon: <Confirmed />,
  },
  {
    label: 'Packaging',
    value: 9,
    icon: <Packaging />,
  },
  {
    label: 'Out for Delivery',
    value: 8,
    icon: <OutforDelivery />,
  },
  {
    label: 'Delivered',
    value: 76,
    icon: <Delivered />,
  },
  {
    label: 'Canceled',
    value: 9,
    icon: <Canceled />,
  },
  {
    label: 'Returned',
    value: 4,
    icon: <Returned />,
  },
  {
    label: 'Failed to Deliver',
    value: 5,
    icon: <FailedtoDeliver />,
  },
];
function DashboardPage() {
  return (
    <>
      <ScrollContainer>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8  ">
          {status.map((stat) => (
            <div
              key={stat.label}
              className="bg-white border-t shadow rounded-lg p-4 relative hover:shadow-md transition-shadow font-bold"
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
                <p className="text-sm text-gray-600 font-bold ">
                  {status.label}
                </p>
                <p className="text-lg font-bold text-blue-600">
                  {status.value}
                </p>
              </div>
            ))}
          </div>
        </div>
        <DashAdminWallet />
      </ScrollContainer>
    </>
  );
}

export default DashboardPage;
