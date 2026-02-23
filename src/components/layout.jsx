import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar.jsx';
import Header from './header.jsx';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-roboto">
      
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        <Header />

        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};

export default Layout;