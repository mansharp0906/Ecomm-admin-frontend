import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SideBar from './Sidebar/sidebar';
import Navbar from './Navbar/Navbar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const authPages = [
    '/login',
    '/register',
    '/otp',
    '/forgot',
    '/change-pass',
    '/forgot-password',
  ];

  const isAuthPage = authPages.includes(location.pathname);

  return (
    <>
      {!isAuthPage && (
        <header className="fixed top-0 left-0 right-0 h-16 z-50 border-b border-gray-200 bg-white shadow-sm">
          <div
            className={`transition-all duration-300 ${
              sidebarOpen ? 'ml-64' : ''
            }`}
          >
            <Navbar />
          </div>
        </header>
      )}

      <div className="flex pt-16">
        {!isAuthPage && (
          <aside
            className={`sticky top-10 left-0 h-screen z-40 transition-width duration-300 ease-in-out 
              ${sidebarOpen ? 'w-64' : 'w-16'}`}
          >
            <SideBar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </aside>
        )}

        <main
          className=" flex-1 bg-gray-100 min-h-[calc(100vh-4rem)] overflow-auto transition-all duration-300}
"
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
