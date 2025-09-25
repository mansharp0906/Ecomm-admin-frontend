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
          <Navbar />
        </header>
      )}

      <div className="flex min-h-screen">
        {!isAuthPage && (
          <aside
            className={`fixed top-16 left-0 h-[calc(100vh-4rem)] z-40 transition-all duration-300 ease-in-out bg-white border-r border-gray-200
              ${sidebarOpen ? 'w-72' : 'w-16'}`}
          >
            <SideBar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </aside>
        )}

        <main
          className={`flex-1 bg-gray-100 transition-all duration-300 ${
            isAuthPage
              ? 'pt-0 ml-0 h-screen'
              : `pt-16 ${sidebarOpen ? 'ml-72' : 'ml-16'} h-[calc(100vh-4rem)]`
          } flex flex-col`}
        >
          <div
            className={`${
              isAuthPage ? 'flex-1 h-full' : 'flex-1 h-full'
            } overflow-y-auto`}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
