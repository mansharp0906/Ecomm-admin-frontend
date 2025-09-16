import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MdArrowDropDown,
  MdInventory,
  MdReceiptLong,
  MdCampaign,
  MdBusiness,
  MdBuild,
  MdAssessment,
} from 'react-icons/md';
import { FaBoxOpen, FaUsersCog, FaBars, FaTimes } from 'react-icons/fa';
import { TbLayoutDashboard } from 'react-icons/tb';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const handleLinkClick = () => {
    // Close sidebar and dropdown on mobile
    setSidebarOpen(false);
    setOpenDropdown(null);
  };

  return (
    <>
      {/* Mobile hamburger toggle button */}
      <button
        className={`md:hidden fixed top-4 ${
          sidebarOpen ? 'right-4' : 'left-4'
        } z-50 text-white text-primary-100 p-2 transition-all duration-300`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar container */}
      <div
        className={`fixed top-0 left-0 h-screen w-64  p-6 text-primary-100 z-40
          transform transition-transform duration-300 rounded shadow-xl
          ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static md:block
        `}
      >
        <h2 className="font-semibold mb-6 text-26">Menu</h2>
        <nav>
          <ul className="list-none p-0 space-y-1">
            {/* Dashboard Link */}
            <li>
              <Link
                to="/dashboard"
                className="block px-4 py-2 hover:bg-primay-400 no-underline"
                onClick={handleLinkClick}
              >
                <div className="flex items-center text-primary-100">
                  <TbLayoutDashboard className="text-2xl mr-3" />
                  <span>Dashboard</span>
                </div>
              </Link>
            </li>

            {/* Product Section Dropdown */}
            <li>
              <button
                className="w-full text-left px-4 py-2 hover:bg-primay-400 flex justify-between items-center text-primary-100"
                onClick={() => toggleDropdown('productSection')}
                aria-expanded={openDropdown === 'productSection'}
              >
                <MdInventory className="text-2xl mr-2" />
                <span>Product Section</span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    openDropdown === 'productSection' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'productSection' && (
                <ul className="bg-white shadow-xl rounded mt-1 pl-4 text-gray-700">
                  {[
                    { label: 'POS', path: '/pos' },
                    { label: 'Product Report', path: '/pos/report' },
                  ].map(({ label, path }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={handleLinkClick}
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200 "
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Order Section Dropdown */}
            <li>
              <button
                className="w-full text-left px-4 py-2 hover:bg-primay-400 flex justify-between items-center text-primary-100"
                onClick={() => toggleDropdown('orderSection')}
                aria-expanded={openDropdown === 'orderSection'}
              >
                <MdReceiptLong className="text-3xl mr-2" />
                <span>Order Section</span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    openDropdown === 'orderSection' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'orderSection' && (
                <ul className="text-gray-900 shadow-xl rounded mt-1 pl-8 bg-white">
                  {[
                    { label: 'All Orders', path: '/orders/all' },
                    { label: 'Pending', path: '/orders/pending' },
                    { label: 'Confirm', path: '/orders/confirmed' },
                    { label: 'Delivered', path: '/orders/delivered' },
                    { label: 'Canceled', path: '/orders/canceled' },
                    { label: 'Return', path: '/orders/return' },
                    { label: 'Refund Request', path: '/orders/refund' },
                  ].map(({ label, path }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={handleLinkClick}
                        className="block px-4 py-2 rounded transition-colors duration-200 text-gray-700 hover:bg-gray-200 "
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Product Management Dropdown */}
            <li>
              <button
                className="w-full text-left px-4 py-2 hover:bg-primay-400 flex justify-between items-center text-primary-100"
                onClick={() => toggleDropdown('productManagement')}
                aria-expanded={openDropdown === 'productManagement'}
              >
                <FaBoxOpen className="text-3xl mr-2" />
                <span>Product Management</span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    openDropdown === 'productManagement' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'productManagement' && (
                <ul className="bg-white shadow-xl rounded mt-1 pl-4 text-gray-700">
                  {[
                    { label: 'Categories', path: '/products/categories' },
                    {
                      label: 'Sub Categories',
                      path: '/products/subcategories',
                    },
                    { label: 'Brands', path: '/products/brands' },
                    { label: 'Add Product', path: '/products/add' },
                    { label: 'Product List', path: '/products/list' },
                    { label: 'Vendors Products', path: '/products/vendors' },
                    { label: 'Refund Request', path: '/pos/report' },
                  ].map(({ label, path }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={handleLinkClick}
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200 "
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Promotion Management Dropdown */}
            <li>
              <button
                className="w-full text-left px-4 py-2 hover:bg-primay-400 flex justify-between items-center text-primary-100"
                onClick={() => toggleDropdown('promotionManagement')}
                aria-expanded={openDropdown === 'promotionManagement'}
              >
                <MdCampaign className="text-3xl mr-2" />
                <span>Promotion Management</span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    openDropdown === 'promotionManagement' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'promotionManagement' && (
                <ul className="bg-white shadow-xl rounded mt-1 pl-4 text-gray-700">
                  {[
                    { label: 'Banners', path: '/promotions/banners' },
                    { label: 'Coupons', path: '/promotions/coupons' },
                    { label: 'Flash Deals', path: '/promotions/flash-deals' },
                    { label: 'Featured Deals', path: '/promotions/featured' },
                  ].map(({ label, path }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={handleLinkClick}
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200 "
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Reports & Analysis Dropdown */}
            <li>
              <button
                className="w-full text-left px-4 py-2 hover:bg-primay-400 flex justify-between items-center text-primary-100"
                onClick={() => toggleDropdown('reportsAnalysis')}
                aria-expanded={openDropdown === 'reportsAnalysis'}
              >
                <MdAssessment className="text-3xl mr-2" />
                <span>Reports & Analysis</span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    openDropdown === 'reportsAnalysis' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'reportsAnalysis' && (
                <ul className="bg-white shadow-xl rounded mt-1 pl-4 text-gray-700">
                  {[
                    { label: 'Sales Report', path: '/reports/sales' },
                    { label: 'Earning Reports', path: '/reports/earnings' },
                    { label: 'Product Report', path: '/reports/products' },
                    { label: 'Order Report', path: '/reports/orders' },
                  ].map(({ label, path }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={handleLinkClick}
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200 "
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* User Management Dropdown */}
            <li>
              <button
                className="w-full text-left px-4 py-2 hover:bg-primay-400 flex justify-between items-center text-primary-100"
                onClick={() => toggleDropdown('userManagement')}
                aria-expanded={openDropdown === 'userManagement'}
              >
                <FaUsersCog className="text-3xl mr-2" />
                <span>User Management</span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    openDropdown === 'userManagement' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'userManagement' && (
                <ul className="bg-white shadow-xl rounded mt-1 pl-4 text-gray-700">
                  {[
                    { label: 'Customers', path: '/users/customers' },
                    { label: 'Vendors', path: '/users/vendors' },
                    { label: 'Employees', path: '/users/employees' },
                    { label: 'Delivery Men', path: '/users/delivery-men' },
                  ].map(({ label, path }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={handleLinkClick}
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200 "
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Business Settings Dropdown */}
            <li>
              <button
                className="w-full text-left px-4 py-2 hover:bg-primay-400 flex justify-between items-center text-primary-100"
                onClick={() => toggleDropdown('businessSettings')}
                aria-expanded={openDropdown === 'businessSettings'}
              >
                <MdBusiness className="text-3xl mr-2" />
                <span>Business Settings</span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    openDropdown === 'businessSettings' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'businessSettings' && (
                <ul className="bg-white shadow-xl rounded mt-1 pl-4 text-gray-700">
                  {[
                    { label: 'Business Setup', path: '/settings/business' },
                    { label: 'Payment Methods', path: '/settings/payments' },
                    { label: 'SEO Settings', path: '/settings/seo' },
                    { label: 'Pages & Media', path: '/settings/pages' },
                  ].map(({ label, path }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={handleLinkClick}
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200 "
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* System Settings Dropdown */}
            <li>
              <button
                className="w-full text-left px-4 py-2 hover:bg-primay-400 flex justify-between items-center text-primary-100"
                onClick={() => toggleDropdown('systemSettings')}
                aria-expanded={openDropdown === 'systemSettings'}
              >
                <MdBuild className="text-3xl mr-2" />
                <span>System Settings</span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    openDropdown === 'systemSettings' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'systemSettings' && (
                <ul className="bg-white shadow-xl rounded mt-1 pl-4 text-gray-700">
                  {[
                    { label: 'Login Settings', path: '/system/login' },
                    { label: 'Email Template', path: '/system/emails' },
                    {
                      label: 'Third Party Setup',
                      path: '/system/integrations',
                    },
                  ].map(({ label, path }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={handleLinkClick}
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200 "
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
