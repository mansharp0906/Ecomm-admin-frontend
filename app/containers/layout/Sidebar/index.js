import React from 'react';
import { Link } from 'react-router-dom';
import {
  MdArrowDropDown,
  MdInventory,
  MdReceiptLong,
  MdCampaign,
  MdBusiness,
  MdBuild,
  MdAssessment,
} from 'react-icons/md'; // React icon import
import { FaBoxOpen, FaUsersCog } from 'react-icons/fa';
import { TbLayoutDashboard } from 'react-icons/tb';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen fixed bg-gray-600 p-4 text-white">
      <h2 className="text-2xl font-semibold mb-6">Menu</h2>
      <nav>
        <ul className="list-none p-0">
          <li>
            <Link
              to="/dashboard"
              className="block px-4 py-2 hover:bg-gray-800 no-underline"
            >
              <div className="flex items-center">
                <TbLayoutDashboard className="text-3xl mr-3" />
                <span>Dashboard</span>
              </div>
            </Link>
          </li>

          <li className="relative group">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex justify-between items-center">
              <MdInventory className="text-3xl mr-2" /> Product Section{' '}
              <MdArrowDropDown className="inline ml-2" />
            </button>
            <ul className="absolute left-full top-0 mt-0 hidden group-hover:block bg-gray-800 rounded shadow-lg min-w-max z-10">
              <li>
                <Link to="/pos" className="block px-4 py-2 hover:bg-gray-700">
                  POS
                </Link>
              </li>
              <li>
                <Link
                  to="/pos/report"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Product Report
                </Link>
              </li>
            </ul>
          </li>
          <li className="relative group">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex justify-between items-center">
              <MdReceiptLong className="text-3xl mr-2" />
              Order Section <MdArrowDropDown className="inline ml-2" />
            </button>
            <ul className="absolute left-full top-0 mt-0 hidden group-hover:block bg-gray-800 rounded shadow-lg min-w-max z-10">
              <li>
                <Link
                  to="/orders/all"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  All Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/orders/pending"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Pending
                </Link>
              </li>
              <li>
                <Link
                  to="/orders/confirmed"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Confirm
                </Link>
              </li>
              <li>
                <Link
                  to="/orders/delivered"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Delivered
                </Link>
              </li>
              <li>
                <Link
                  to="/orders/canceled"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Canceled
                </Link>
              </li>
              <li>
                <Link
                  to="/orders/return"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Return
                </Link>
              </li>
              <li>
                <Link
                  to="/orders/refund"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Refund Request
                </Link>
              </li>
            </ul>
          </li>
          <li className="relative group">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex justify-between items-center">
              <FaBoxOpen className="text-3xl mr-2" />
              Product Management <MdArrowDropDown className="inline ml-2" />
            </button>
            <ul className="absolute left-full top-0 mt-0 hidden group-hover:block bg-gray-800 rounded shadow-lg min-w-max z-10">
              <li>
                <Link
                  to="/products/categories"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/products/subcategories"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Sub Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/products/brands"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Brands
                </Link>
              </li>
              <li>
                <Link
                  to="/products/add"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Add Product
                </Link>
              </li>
              <li>
                <Link
                  to="/products/list"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Product List
                </Link>
              </li>
              <li>
                <Link
                  to="/products/vendors"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Vendors Products
                </Link>
              </li>
              <li>
                <Link
                  to="/pos/report"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Refund Request
                </Link>
              </li>
            </ul>
          </li>
          <li className="relative group">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex justify-between items-center">
              <MdCampaign className="text-3xl mr-2" />
              Promotion Management <MdArrowDropDown className="inline ml-2" />
            </button>
            <ul className="absolute left-full top-0 mt-0 hidden group-hover:block bg-gray-800 rounded shadow-lg min-w-max z-10">
              <li>
                <Link
                  to="/promotions/banners"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Banners
                </Link>
              </li>
              <li>
                <Link
                  to="/promotions/coupons"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Coupons
                </Link>
              </li>
              <li>
                <Link
                  to="/promotions/flash-deals"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Flash Deals
                </Link>
              </li>
              <li>
                <Link
                  to="/promotions/featured"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Featured Deals
                </Link>
              </li>
            </ul>
          </li>
          <li className="relative group">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex justify-between items-center">
              <MdAssessment className="text-3xl mr-2" />
              Reports & Analysis <MdArrowDropDown className="inline ml-2" />
            </button>
            <ul className="absolute left-full top-0 mt-0 hidden group-hover:block bg-gray-800 rounded shadow-lg min-w-max z-10">
              <li>
                <Link
                  to="/reports/sales"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Sales Report
                </Link>
              </li>
              <li>
                <Link
                  to="/reports/earnings"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Earning Reports
                </Link>
              </li>
              <li>
                <Link
                  to="/reports/products"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Product Report
                </Link>
              </li>
              <li>
                <Link
                  to="/reports/orders"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Order Report
                </Link>
              </li>
            </ul>
          </li>
          <li className="relative group">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex justify-between items-center">
              <FaUsersCog className="text-3xl mr-2" />
              User Management <MdArrowDropDown className="inline ml-2" />
            </button>
            <ul className="absolute left-full top-0 mt-0 hidden group-hover:block bg-gray-800 rounded shadow-lg min-w-max z-10">
              <li>
                <Link
                  to="/users/customers"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Customers
                </Link>
              </li>
              <li>
                <Link
                  to="/users/vendors"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Vendors
                </Link>
              </li>
              <li>
                <Link
                  to="/users/employees"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Employees
                </Link>
              </li>
              <li>
                <Link
                  to="/users/delivery-men"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Delivery Men
                </Link>
              </li>
            </ul>
          </li>
          <li className="relative group">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex justify-between items-center">
              <MdBusiness className="text-3xl mr-2" />
              Business Settings
              <MdArrowDropDown className="inline ml-2" />
            </button>
            <ul className="absolute left-full top-0 mt-0 hidden group-hover:block bg-gray-800 rounded shadow-lg min-w-max z-10">
              <li>
                <Link
                  to="/settings/business"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Business Setup
                </Link>
              </li>
              <li>
                <Link
                  to="/settings/payments"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link
                  to="/settings/seo"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  SEO Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/settings/pages"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Pages & Media
                </Link>
              </li>
            </ul>
          </li>
          <li className="relative group">
            <button className="w-full text-left px-4 py-2 hover:bg-gray-700 flex justify-between items-center">
              <MdBuild className="text-3xl mr-2" />
              System Settings <MdArrowDropDown className="inline ml-2" />
            </button>
            <ul className="absolute left-full top-0 mt-0 hidden group-hover:block bg-gray-800 rounded shadow-lg min-w-max z-10">
              <li>
                <Link
                  to="/system/login"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Login Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/system/emails"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Email Template
                </Link>
              </li>
              <li>
                <Link
                  to="/system/integrations"
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Third Party Setup
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
