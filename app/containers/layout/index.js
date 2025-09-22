/*eslint-disable*/
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SideBar from './Sidebar/sidebar';
import Navbar from './Navbar/Navbar';

const Layout = () => {
  const location = useLocation();
  const authPages = [
    '/login',
    '/register',
    '/otp',
    '/forgot',
    '/change-pass',
    '/forgot-password',
  ];
  const noNavbarRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/otp',
    '/forgot',
    '/change-pass',
  ];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <>
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
      <div className="flex">
        {!isAuthPage && <SideBar />}
        <div className="flex-1 mt-20">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
