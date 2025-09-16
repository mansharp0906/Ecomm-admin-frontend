/*eslint-disable*/

import React from 'react';

import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const urls = ['/login', '/register', '/otp', '/forgot', '/change-pass'];
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Layout;
