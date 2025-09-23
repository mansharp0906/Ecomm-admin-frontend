import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowDropDown } from 'react-icons/md';

const ToggleIcon = ({ onClick, isOpen }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`w-8 h-8 mb-5 cursor-pointer fixed top-30 z-50 transition-transform duration-300
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

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    setOpenDropdown(null);
  };

  return (
    <div>
      <aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] transition-all duration-300 
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
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="min-w-[32px] min-h-[32px]"
                  >
                    <rect
                      x="14"
                      y="34"
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    width="28"
                    height="24"
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    width="28"
                    height="24"
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    width="28"
                    height="24"
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    width="30"
                    height="30"
                  >
                    <circle cx="32" cy="20" r="10" fill="#10b981" />
                    <path d="M12 48c0-8 9-14 20-14s20 6 20 14" fill="#facc15" />
                  </svg>
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    width="36"
                    height="36"
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

export default Sidebar;
