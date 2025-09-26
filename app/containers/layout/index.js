import React, { useState, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SideBar from './Sidebar/sidebar';
import Navbar from './Navbar/Navbar';
import ErrorBoundary from '@/components/ErrorBoundary';

const LAYOUT_CONSTANTS = {
  HEADER_HEIGHT: 'h-16',
  HEADER_Z_INDEX: 'z-50',
  SIDEBAR_WIDTH_OPEN: 'w-72',
  SIDEBAR_WIDTH_CLOSED: 'w-16',
  SIDEBAR_Z_INDEX: 'z-40',
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Memoize authPages array
  const authPages = useMemo(
    () => [
      '/login',
      '/register',
      '/otp',
      '/forgot',
      '/change-pass',
      '/forgot-password',
    ],
    [],
  );

  // Memoize isAuthPage calculation
  const isAuthPage = useMemo(
    () => authPages.includes(location.pathname),
    [authPages, location.pathname],
  );

  // Helper function for main className
  const getMainClassName = (isAuthPage, sidebarOpen) => {
    const baseClasses =
      'flex-1 bg-gray-100 transition-all duration-300 flex flex-col';

    if (isAuthPage) {
      return `${baseClasses} pt-0 ml-0 h-screen`;
    }

    const sidebarMargin = sidebarOpen ? 'ml-72' : 'ml-16';
    return `${baseClasses} pt-16 ${sidebarMargin} h-[calc(100vh-4rem)]`;
  };

  return (
    <>
      {!isAuthPage && (
        <header
          className={`fixed top-0 left-0 right-0 ${LAYOUT_CONSTANTS.HEADER_HEIGHT} ${LAYOUT_CONSTANTS.HEADER_Z_INDEX} border-b border-gray-200 bg-white shadow-sm`}
        >
          <Navbar />
        </header>
      )}

      <div className="flex min-h-screen">
        {!isAuthPage && (
          <aside
            className={`fixed top-16 left-0 h-[calc(100vh-4rem)] ${
              LAYOUT_CONSTANTS.SIDEBAR_Z_INDEX
            } transition-all duration-300 ease-in-out bg-white border-r border-gray-200
              ${
                sidebarOpen
                  ? LAYOUT_CONSTANTS.SIDEBAR_WIDTH_OPEN
                  : LAYOUT_CONSTANTS.SIDEBAR_WIDTH_CLOSED
              }`}
          >
            <SideBar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </aside>
        )}

        <main className={getMainClassName(isAuthPage, sidebarOpen)}>
          <ErrorBoundary>
            <div className="flex-1 h-full overflow-hidden">
              <Outlet />
            </div>
          </ErrorBoundary>
        </main>
      </div>
    </>
  );
};

export default Layout;
