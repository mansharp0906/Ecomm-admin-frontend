/*eslint-disable*/
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SideBar from './Sidebar';

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
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <div className="flex">
      {!isAuthPage && <SideBar />}
      <div className={`${!isAuthPage ? 'ml-64' : ''} flex-1`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
