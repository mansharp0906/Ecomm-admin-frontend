import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { MdArrowDropDown } from 'react-icons/md';
import {
  DashboardIcon,
  ProductIcon,
  OrderIcon,
  ProductManagementIcon,
  PromotionIcon,
  ReportsIcon,
  UserManagementIcon,
  BusinessSettingsIcon,
  SystemSettingsIcon,
} from '../../../components/custom-icon/SidebarIcons';

const ToggleIcon = ({ onClick, isOpen }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`w-8 h-8 mb-5 cursor-pointer fixed top-20 z-50 transition-transform duration-300
    ${isOpen ? 'left-60 rotate-180 text-blue-500' : 'left-11 text-gray-700'}`}
  >
    {isOpen ? (
      <path
        d="M16 19l-6-7 6-7M12 19l-6-7 6-7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <path
        d="M8 5l6 7-6 7M12 5l6 7-6 7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
  </svg>
);

ToggleIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (key) => {
    // Only toggle dropdown if sidebar is open
    if (!sidebarOpen) return;
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const handleLinkClick = () => {
    setOpenDropdown(null);
  };

  return (
    <div>
      <aside
        className={`w-full h-full transition-all duration-300 bg-white border-r border-gray-200
    ${sidebarOpen ? 'w-64' : 'w-16'}`}
      >
        <ToggleIcon
          onClick={() => setSidebarOpen(!sidebarOpen)}
          isOpen={sidebarOpen}
          className="mb-4 mr-5"
        />

        <nav className=" pt-10 space-y-2  ">
          {/* Example Dashboard Link */}
          <ul className="list-none">
            <li>
              <Link
                to="/dashboard"
                className="block px-4 py-2 no-underline hover:bg-gray-200 rounded"
                onClick={handleLinkClick}
              >
                <div className="flex items-center gap-3">
                  <DashboardIcon />

                  <span
                    className={`transition-opacity duration-300 ${
                      sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                    }`}
                  >
                    Dashboard
                  </span>
                </div>
              </Link>
            </li>

            {/* Example dropdown: Product Section */}
            <li>
              <button
                className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-gray-200"
                onClick={() => toggleDropdown('productSection')}
                aria-expanded={openDropdown === 'productSection'}
              >
                <div className="flex items-center gap-2">
                  <ProductIcon />
                  <span
                    className={`transition-opacity duration-300 ml-2 ${
                      sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                    }`}
                  >
                    Product Section
                  </span>
                </div>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform  ${
                    openDropdown === 'productSection' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <ul
                className={`overflow-hidden transition-all duration-300 ${
                  openDropdown === 'productSection' ? 'max-h-96' : 'max-h-0'
                } shadow-xl rounded mt-1 pl-4`}
              >
                {[
                  { label: 'POS', path: '/pos' },
                  { label: 'Product Report', path: '/pos/report' },
                ].map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      onClick={handleLinkClick}
                      className="block px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Order Section Dropdown */}
            <li>
              <button
                className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-gray-200"
                onClick={() => toggleDropdown('orderSection')}
                aria-expanded={openDropdown === 'orderSection'}
              >
                {/* <MdReceiptLong className="text-3xl mr-2" /> */}
                <span className="">
                  <OrderIcon />
                </span>

                <span
                  className={`transition-opacity duration-300 mr-12 ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                  }`}
                >
                  Order Section
                </span>

                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    openDropdown === 'orderSection' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'orderSection' && (
                <ul className="text-gray-900 shadow-xl rounded mt-1 pl-8">
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
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200"
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
                className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-gray-200"
                onClick={() => toggleDropdown('productManagement')}
                aria-expanded={openDropdown === 'productManagement'}
              >
                {/* <FaBoxOpen className="text-3xl mr-2" /> */}
                <span className="inline-block mr-2">
                  <ProductManagementIcon />
                </span>
                <span
                  className={`transition-opacity duration-300 ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                  }`}
                >
                  Product Management
                </span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    openDropdown === 'productManagement' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'productManagement' && (
                <ul className="shadow-xl rounded mt-1 relative z-50 border border-gray-200">
                  {[
                    {
                      label: 'Categories',
                      path: '/products/categories',
                      subItems: [
                        {
                          label: 'Sub Categories',
                          path: '/products/subcategories',
                        },
                        {
                          label: 'Sub Sub-Categories',
                          path: '/products/subSubcategories',
                        },
                      ],
                    },
                    { label: 'Brands', path: '/products/brands' },
                    { label: 'Attributes', path: '/products/attributes' },
                    { label: 'Product In House', path: '/products/inhouse' },
                    { label: 'Vendors Products', path: '/products/vendors' },
                    { label: 'Bulk import', path: '/products/import' },
                  ].map(({ label, path, subItems }) => (
                    <li key={path} className="relative group">
                      <Link
                        to={path}
                        onClick={handleLinkClick}
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200"
                      >
                        {label}
                      </Link>

                      {/* Submenu opens below */}
                      {subItems && (
                        <ul className="absolute left-20 top-0 mt-10 w-44 text-sm bg-white border border-gray-300 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-50">
                          {subItems.map(
                            ({ label: subLabel, path: subPath }) => (
                              <li key={subPath}>
                                <Link
                                  to={subPath}
                                  className="block px-4 py-2 hover:bg-gray-100"
                                  onClick={handleLinkClick}
                                >
                                  {subLabel}
                                </Link>
                              </li>
                            ),
                          )}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {/* Promotion Management Dropdown */}
            <li>
              <button
                className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-gray-200"
                onClick={() => toggleDropdown('promotionManagement')}
                aria-expanded={openDropdown === 'promotionManagement'}
              >
                {/* <MdCampaign className="text-3xl mr-2" /> */}
                <span className="inline-block mr-2">
                  <PromotionIcon />
                </span>
                <span
                  className={`transition-opacity duration-300  pl-1 ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                  }`}
                >
                  Promotion Management
                </span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    openDropdown === 'promotionManagement' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'promotionManagement' && (
                <ul className="shadow-xl rounded mt-1 pl-4">
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
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200"
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
                className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-gray-200"
                onClick={() => toggleDropdown('reportsAnalysis')}
                aria-expanded={openDropdown === 'reportsAnalysis'}
              >
                {/* <MdAssessment className="text-3xl mr-2" /> */}
                <span className="inline-block mr-2">
                  <ReportsIcon />
                </span>

                <span
                  className={`transition-opacity duration-300 mr-6 ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                  }`}
                >
                  Reports & Analysis
                </span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    openDropdown === 'reportsAnalysis' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'reportsAnalysis' && (
                <ul className="shadow-xl rounded mt-1 pl-4">
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
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200"
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
                className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-gray-200"
                onClick={() => toggleDropdown('userManagement')}
                aria-expanded={openDropdown === 'userManagement'}
              >
                {/* <FaUsersCog className="text-3xl mr-2" /> */}
                <span className="inline-block mr-2">
                  <UserManagementIcon />
                </span>
                <span
                  className={`transition-opacity duration-300  mr-6 ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                  }`}
                >
                  User Management
                </span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    openDropdown === 'userManagement' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'userManagement' && (
                <ul className="shadow-xl rounded mt-1 pl-4">
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
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200"
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
                className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-gray-200"
                onClick={() => toggleDropdown('businessSettings')}
                aria-expanded={openDropdown === 'businessSettings'}
              >
                {/* <MdBusiness className="text-3xl mr-2" /> */}
                <span className="inline-block mr-2">
                  <BusinessSettingsIcon />
                </span>
                <span
                  className={`transition-opacity duration-300 mr-6 ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                  }`}
                >
                  Business Settings
                </span>

                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    openDropdown === 'businessSettings' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'businessSettings' && (
                <ul className="shadow-xl rounded mt-1 pl-4">
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
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200"
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
                className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-gray-200"
                onClick={() => toggleDropdown('systemSettings')}
                aria-expanded={openDropdown === 'systemSettings'}
              >
                <span className="inline-block mr-2">
                  <SystemSettingsIcon />
                </span>

                {/* Label */}
                <span
                  className={`transition-opacity duration-300  mr-6 ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                  }`}
                >
                  System Settings
                </span>

                {/* Dropdown arrow */}
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    openDropdown === 'systemSettings' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown menu */}
              {openDropdown === 'systemSettings' && (
                <ul className="shadow-xl rounded mt-1 pl-4 text-sm">
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
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200"
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
      </aside>
    </div>
  );
};

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};

export default Sidebar;
