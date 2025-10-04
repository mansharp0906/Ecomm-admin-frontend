import React, { useState, useEffect } from 'react';
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
    className={`fixed top-20 w-8 h-8 z-50 transition-transform duration-300 transform ${
      isOpen ? 'translate-x-70 rotate-180 text-blue-500' : 'translate-x-15 text-gray-700'
    }`}
  >
    {isOpen ? (
      // Right-facing arrow (>)
      <path d="M8 5l8 7-8 7" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      // Left-facing arrow (<)
      <path d="M8 5l8 7-8 7s" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </svg>
);

ToggleIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  // Close any open dropdown if sidebar closes
  useEffect(() => {
    if (!sidebarOpen) {
      setOpenDropdown(null);
    }
  }, [sidebarOpen]);

  const toggleDropdown = (key) => {
    // Only toggle dropdown when sidebar is open
    if (!sidebarOpen) return;
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const handleLinkClick = () => {
    setOpenDropdown(null);
  };

  return (
    <div>
      <div className={`w-full h-full transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} flex flex-col`}>
        <ToggleIcon onClick={() => setSidebarOpen(!sidebarOpen)} isOpen={sidebarOpen} style={{ marginTop: '10rem', marginLeft: '-10px' }} />

        <nav className="pt-6 flex-1 overflow-y-auto no-scrollbar">
          <ul className="list-none">
            {/* Dashboard Link */}
            <li>
              <Link
                to="/dashboard"
                className="block px-4 py-2 no-underline hover:bg-gray-200 rounded whitespace-nowrap"
                onClick={handleLinkClick}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <DashboardIcon />
                  <span className={`transition-opacity ml-2 duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'} truncate`}>
                    Dashboard
                  </span>
                </div>
              </Link>
            </li>

            {/* Product Section Dropdown */}
            <li>
              <button
                className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-gray-200 whitespace-nowrap"
                onClick={() => toggleDropdown('productSection')}
                aria-expanded={openDropdown === 'productSection'}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <ProductIcon />
                  <span className={`transition-opacity ml-4 duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'} truncate`}>
                    Product Section
                  </span>
                </div>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                  } ${openDropdown === 'productSection' ? 'rotate-180' : ''}`}
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
                      className="block px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-200 whitespace-nowrap"
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
                className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-gray-200 whitespace-nowrap"
                onClick={() => toggleDropdown('orderSection')}
                aria-expanded={openDropdown === 'orderSection'}
              >
                <span className="">
                  <OrderIcon />
                </span>
                <span className={`transition-opacity duration-300 mr-16 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'} truncate`}>
                  Order Section
                </span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                  } ${openDropdown === 'orderSection' ? 'rotate-180' : ''}`}
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
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200 whitespace-nowrap"
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
                className="w-full px-4 py-2 flex justify-between items-center hover:bg-gray-200 whitespace-nowrap"
                onClick={() => toggleDropdown('productManagement')}
                aria-expanded={openDropdown === 'productManagement'}
              >
                <span className="inline-block mr-2">
                  <ProductManagementIcon />
                </span>
                <span className={`transition-opacity duration-300 mr-4 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'} truncate`}>
                  Product Management
                </span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                  } ${openDropdown === 'productManagement' ? 'rotate-180' : ''}`}
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
                    { label: 'Product In House', path: '/products/products' },
                    { label: 'Vendors Products', path: '/products/vendors' },
                    { label: 'Bulk import', path: '/products/import' },
                  ].map(({ label, path, subItems }) => (
                    <li key={path} className="relative group">
                      <Link
                        to={path}
                        onClick={handleLinkClick}
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200 whitespace-nowrap"
                      >
                        {label}
                      </Link>

                      {/* Submenu */}
                      {subItems && (
                        <ul className="absolute left-20 top-0 mt-10 w-44 text-sm bg-white border border-gray-300 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-50">
                          {subItems.map(({ label: subLabel, path: subPath }) => (
                            <li key={subPath}>
                              <Link
                                to={subPath}
                                className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap"
                                onClick={handleLinkClick}
                              >
                                {subLabel}
                              </Link>
                            </li>
                          ))}
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
                className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-gray-200 whitespace-nowrap"
                onClick={() => toggleDropdown('promotionManagement')}
                aria-expanded={openDropdown === 'promotionManagement'}
              >
                <span className="inline-block mr-2">
                  <PromotionIcon />
                </span>
                <span className={`transition-opacity duration-300 text-star mr-1 pl-1 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'} truncate`}>
                  Promotion Management
                </span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                  } ${openDropdown === 'promotionManagement' ? 'rotate-180' : ''}`}
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
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200 whitespace-nowrap"
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
                className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-gray-200 whitespace-nowrap"
                onClick={() => toggleDropdown('reportsAnalysis')}
                aria-expanded={openDropdown === 'reportsAnalysis'}
              >
                <span className="inline-block mr-2">
                  <ReportsIcon />
                </span>

                <span className={`transition-opacity text-start mr-9 duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'} truncate`}>
                  Reports & Analysis
                </span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                  } ${openDropdown === 'reportsAnalysis' ? 'rotate-180' : ''}`}
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
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200 whitespace-nowrap"
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
                className="w-full text-left px-4 py-1 flex justify-between items-center hover:bg-gray-200 whitespace-nowrap"
                onClick={() => toggleDropdown('userManagement')}
                aria-expanded={openDropdown === 'userManagement'}
              >
                <span className="inline-block mr-2">
                  <UserManagementIcon />
                </span>
                <span className={`transition-opacity text-start mr-12 duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'} truncate`}>
                  User Management
                </span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                  } ${openDropdown === 'userManagement' ? 'rotate-180' : ''}`}
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
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200 whitespace-nowrap"
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
                className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-gray-200 whitespace-nowrap"
                onClick={() => toggleDropdown('businessSettings')}
                aria-expanded={openDropdown === 'businessSettings'}
              >
                <span className="inline-block mr-2">
                  <BusinessSettingsIcon />
                </span>
                <span className={`transition-opacity text-start mr-11 duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'} truncate`}>
                  Business Settings
                </span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                  } ${openDropdown === 'businessSettings' ? 'rotate-180' : ''}`}
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
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200 whitespace-nowrap"
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
                className="w-full text-left px-4 py-2 flex justify-between items-center hover:bg-gray-200 whitespace-nowrap"
                onClick={() => toggleDropdown('systemSettings')}
                aria-expanded={openDropdown === 'systemSettings'}
              >
                <span className="inline-block mr-2">
                  <SystemSettingsIcon />
                </span>
                <span className={`transition-opacity duration-300 text-start mr-12 ${sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'} truncate`}>
                  System Settings
                </span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    sidebarOpen ? 'opacity-100' : 'opacity-0 hidden'
                  } ${openDropdown === 'systemSettings' ? 'rotate-180' : ''}`}
                />
              </button>

              {openDropdown === 'systemSettings' && (
                <ul className="shadow-xl rounded mt-1 pl-4 text-sm">
                  {[
                    { label: 'Login Settings', path: '/system/login' },
                    { label: 'Email Template', path: '/system/emails' },
                    { label: 'Third Party Setup', path: '/system/integrations' },
                  ].map(({ label, path }) => (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={handleLinkClick}
                        className="block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-200 whitespace-nowrap"
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
    </div>
  );
};

Sidebar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};

export default Sidebar;
