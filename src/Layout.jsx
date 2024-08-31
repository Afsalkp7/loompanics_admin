import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';

const Layout = () => {
  const location = useLocation();

  const hideNavbarRoutes = ['/login', '/register', '/auth']; // Add paths for UserAuth components
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Outlet />
    </>
  );
};

export default Layout;
