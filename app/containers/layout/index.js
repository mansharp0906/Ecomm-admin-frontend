/*eslint-disable*/
import React from 'react';
import { useLocation } from 'react-router-dom';
import SideBar from './Sidebar';

const Layout = () => {
  const location = useLocation();
  const urls = ['/login', '/register', '/otp', '/forgot', '/change-pass'];
  return (
    <div>
      <SideBar />
    </div>
  );
};

export default Layout;
