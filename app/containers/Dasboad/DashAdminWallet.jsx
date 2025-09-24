import React from 'react';
import {
  FaChartBar,
  FaDollarSign,
  FaTruck,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
} from 'react-icons/fa';

const walletData = [
  {
    label: 'In-House Earning',
    value: '$39,892.00',
    icon: <FaChartBar className="text-blue-600" />,
  },
  {
    label: 'Commission Earned',
    value: '$12,755.02',
    icon: <FaDollarSign className="text-green-600" />,
  },
  {
    label: 'Delivery Charge Earned',
    value: '$1,360.00',
    icon: <FaTruck className="text-orange-500" />,
  },
  {
    label: 'Total Tax Collected',
    value: '$2,343.00',
    icon: <FaFileInvoiceDollar className="text-red-500" />,
  },
  {
    label: 'Pending Amount',
    value: '$8,153.00',
    icon: <FaMoneyBillWave className="text-purple-600" />,
  },
];

function DashAdminWallet() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 p-6 bg-white rounded-lg shadow-md">
         <h3 className="text-lg font-semibold text-gray-800">
          Business Analysis
        </h3>
        {walletData.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-lg transition"
          >
            <div className="text-3xl">{item.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-xl font-semibold text-gray-800">
                {item.value}
              </p>
            </div>
          </div>
        ))}
     </div>
    </>
  );
}

export default DashAdminWallet;
