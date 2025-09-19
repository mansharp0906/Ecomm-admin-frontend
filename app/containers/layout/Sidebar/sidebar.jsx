import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowDropDown, MdBuild, MdAssessment } from 'react-icons/md';
import { FaBars, FaTimes } from 'react-icons/fa';
// import { TbLayoutDashboard } from 'react-icons/tb';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const handleLinkClick = () => {
    // Close sidebar and dropdown on mobile after clicking a link
    setSidebarOpen(false);
    setOpenDropdown(null);
  };

  return (
    <>
      {/* Mobile hamburger toggle button */}
      <button
        className={`md:hidden fixed top-4 ${
          sidebarOpen ? 'right-4' : 'left-4'
        } z-50 p-2 transition-all duration-300`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <FaTimes size={24} color="white" />
        ) : (
          <FaBars size={24} color="white" />
        )}
      </button>

      {/* Overlay for mobile when sidebar open */}
      {sidebarOpen && (
        <div
          className=" inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar container */}
      <div
        className={` top-0 left-0 w-64 p-6 bg-white z-50 rounded shadow-xl
          transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:block
        `}
      >
        <h2
          className="flex items-center gap-2 text-3xl font-bold mb-6"
          style={{ color: 'var(--color-primary)' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-black"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.38-7.39H6" />
          </svg>
          ShopEase
        </h2>

        <nav>
          <ul className="list-none p-0 space-y-1">
            <li>
              <Link
                to="/dashboard"
                className="block px-4 py-2 no-underline"
                onClick={handleLinkClick}
              >
                <div className="flex items-center">
                  {/* <TbLayoutDashboard className="text-2xl mr-3" />
                   */}
                  <span className="inline-block mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 64 64"
                      width="28"
                      height="28"
                    >
                      {/* Bars */}
                      <rect
                        x="14"
                        y="34"
                        width="8"
                        height="16"
                        fill="#facc15"
                        rx="2"
                      />
                      <rect
                        x="26"
                        y="26"
                        width="8"
                        height="24"
                        fill="#10b981"
                        rx="2"
                      />
                      <rect
                        x="38"
                        y="18"
                        width="8"
                        height="32"
                        fill="#3b82f6"
                        rx="2"
                      />
                      <rect
                        x="50"
                        y="10"
                        width="8"
                        height="40"
                        fill="#ef4444"
                        rx="2"
                      />
                    </svg>
                  </span>

                  <span>Dashboard</span>
                </div>
              </Link>
            </li>

            {/* Product Section Dropdown */}
            <li>
              <button
                className="w-full text-left px-4 py-2 flex justify-between items-center"
                onClick={() => toggleDropdown('productSection')}
                aria-expanded={openDropdown === 'productSection'}
              >
                {/* <MdInventory className="text-2xl mr-2" /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4"
                  />
                  <circle cx="7" cy="21" r="2" />
                  <circle cx="17" cy="21" r="2" />
                </svg>
                <span>Product Section</span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    openDropdown === 'productSection' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'productSection' && (
                <ul className="shadow-xl rounded mt-1 pl-4">
                  {[
                    { label: 'POS', path: '/pos' },
                    { label: 'Product Report', path: '/pos/report' },
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

            {/* Order Section Dropdown */}
            <li>
              <button
                className="w-full text-left px-4 py-2 flex justify-between items-center"
                onClick={() => toggleDropdown('orderSection')}
                aria-expanded={openDropdown === 'orderSection'}
              >
                {/* <MdReceiptLong className="text-3xl mr-2" /> */}
                <span className="inline-block mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    width="28"
                    height="28"
                  >
                    {/* Receipt Background */}
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

                    {/* Header Line */}
                    <rect
                      x="18"
                      y="14"
                      width="28"
                      height="4"
                      rx="2"
                      fill="#4f46e5"
                    />

                    {/* Item Lines */}
                    <rect
                      x="18"
                      y="22"
                      width="20"
                      height="3"
                      rx="1.5"
                      fill="#10b981"
                    />
                    <rect
                      x="18"
                      y="28"
                      width="24"
                      height="3"
                      rx="1.5"
                      fill="#3b82f6"
                    />
                    <rect
                      x="18"
                      y="34"
                      width="16"
                      height="3"
                      rx="1.5"
                      fill="#ef4444"
                    />

                    {/* Total Line */}
                    <rect
                      x="18"
                      y="42"
                      width="28"
                      height="4"
                      rx="2"
                      fill="#f59e0b"
                    />
                  </svg>
                </span>

                <span>Order Section</span>
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
                className="w-full text-left px-4 py-2 flex justify-between items-center"
                onClick={() => toggleDropdown('productManagement')}
                aria-expanded={openDropdown === 'productManagement'}
              >
                {/* <FaBoxOpen className="text-3xl mr-2" /> */}
                <span className="inline-block mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    width="28"
                    height="28"
                  >
                    {/* Box Base */}
                    <path
                      d="M8 24L32 8L56 24V48L32 56L8 48V24Z"
                      fill="#facc15"
                    />

                    {/* Box Lid */}
                    <path d="M8 24L32 32L56 24L32 16L8 24Z" fill="#4f46e5" />

                    {/* Box Shadows */}
                    <path d="M32 32V56L56 48V24L32 32Z" fill="#10b981" />
                    <path d="M32 32V56L8 48V24L32 32Z" fill="#ef4444" />
                  </svg>
                </span>
                <span>Product Management</span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    openDropdown === 'productManagement' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'productManagement' && (
                <ul className="shadow-xl rounded mt-1 pl-4 relative z-50 border border-gray-200">
                  {[
                    {
                      label: 'Categories',
                      path: '/products/categories',
                      subItems: [
                        {
                          label: 'Sub Categories ',
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

                      {/* Nested dropdown for subItems */}
                      {subItems && (
                        <ul className="absolute left-40  top-0 mt-0 ml-1 w-48 bg-white border border-gray-300 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 z-50">
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
                className="w-full text-left px-4 py-2 flex justify-between items-center"
                onClick={() => toggleDropdown('promotionManagement')}
                aria-expanded={openDropdown === 'promotionManagement'}
              >
                {/* <MdCampaign className="text-3xl mr-2" /> */}
                <span className="inline-block mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    width="28"
                    height="28"
                  >
                    {/* Megaphone Body */}
                    <path d="M8 24L40 16V48L8 40V24Z" fill="#4f46e5" />

                    {/* Sound Waves */}
                    <path
                      d="M44 20C48 24 48 40 44 44"
                      stroke="#facc15"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    {/* Handle */}
                    <rect
                      x="16"
                      y="44"
                      width="8"
                      height="12"
                      rx="2"
                      fill="#10b981"
                    />

                    {/* Accent */}
                    <circle cx="32" cy="32" r="4" fill="#ef4444" />
                  </svg>
                </span>
                <span>Promotion Management</span>
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
                className="w-full text-left px-4 py-2 flex justify-between items-center"
                onClick={() => toggleDropdown('reportsAnalysis')}
                aria-expanded={openDropdown === 'reportsAnalysis'}
              >
                {/* <MdAssessment className="text-3xl mr-2" /> */}
                <span className="inline-block mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    width="28"
                    height="28"
                  >
                    <circle cx="32" cy="20" r="10" fill="#10b981" />
                    <path d="M12 48c0-8 9-14 20-14s20 6 20 14" fill="#facc15" />
                  </svg>
                </span>

                <span>Reports & Analysis</span>
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
                className="w-full text-left px-4 py-2 flex justify-between items-center"
                onClick={() => toggleDropdown('userManagement')}
                aria-expanded={openDropdown === 'userManagement'}
              >
                {/* <FaUsersCog className="text-3xl mr-2" /> */}
                <span className="inline-block mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    width="28"
                    height="28"
                  >
                    {/* Background Circle */}
                    <circle cx="32" cy="32" r="32" fill="#ffff" />

                    {/* User Head */}
                    <circle cx="32" cy="22" r="8" fill="#facc15" />

                    {/* Shoulders */}
                    <path d="M18 44c0-6 6-10 14-10s14 4 14 10" fill="#10b981" />

                    {/* Accent Group Icon */}
                    <circle cx="22" cy="26" r="4" fill="#3b82f6" />
                    <circle cx="42" cy="26" r="4" fill="#ef4444" />
                  </svg>
                </span>
                <span>User Management</span>
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
                className="w-full text-left px-4 py-2 flex justify-between items-center"
                onClick={() => toggleDropdown('businessSettings')}
                aria-expanded={openDropdown === 'businessSettings'}
              >
                {/* <MdBusiness className="text-3xl mr-2" /> */}
                <span className="inline-block mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    width="28"
                    height="28"
                  >
                    {/* Building */}
                    <rect
                      x="12"
                      y="16"
                      width="28"
                      height="32"
                      rx="4"
                      fill="#3b82f6"
                    />
                    <rect x="18" y="22" width="6" height="6" fill="#fef3c7" />
                    <rect x="18" y="32" width="6" height="6" fill="#fef3c7" />
                    <rect x="26" y="22" width="6" height="6" fill="#fef3c7" />
                    <rect x="26" y="32" width="6" height="6" fill="#fef3c7" />

                    {/* Gear */}
                    <circle cx="48" cy="48" r="6" fill="#10b981" />
                    <path
                      d="M48 42v2M48 54v2M42 48h2M54 48h2M44.2 44.2l1.4 1.4M51.4 51.4l1.4 1.4M44.2 51.8l1.4-1.4M51.4 44.6l1.4-1.4"
                      stroke="#facc15"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span>Business Settings</span>
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
                className="w-full text-left px-4 py-2 flex justify-between items-center"
                onClick={() => toggleDropdown('systemSettings')}
                aria-expanded={openDropdown === 'systemSettings'}
              >
                <MdBuild className="text-3xl mr-2 text-blue-500" />
                <span className="inline-block mr-2"></span>
                <span>System Settings</span>
                <MdArrowDropDown
                  className={`inline ml-2 transform transition-transform ${
                    openDropdown === 'systemSettings' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'systemSettings' && (
                <ul className="shadow-xl rounded mt-1 pl-4">
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
      </div>
    </>
  );
};

export default Sidebar;
