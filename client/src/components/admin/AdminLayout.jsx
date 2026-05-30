import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { AdminProvider } from '../../context/AdminContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AdminProvider>
      <div
        className="min-h-screen bg-[#f8f5f2]"
        style={{ fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif' }}
      >
        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <div className="lg:pl-64 flex flex-col min-h-screen transition-all duration-300">
          <AdminHeader setIsSidebarOpen={setIsSidebarOpen} />
          
          <main className="flex-1 px-4 py-5 sm:px-6 md:p-10">
            <div className="max-w-7xl mx-auto min-w-0">
              <Outlet />
            </div>
          </main>
          
          <footer className="px-4 py-6 text-center text-[#a3948b] text-xs sm:text-sm">
            &copy; 2024 KAMARI Admin Portal. All rights reserved.
          </footer>
        </div>
      </div>
    </AdminProvider>
  );
};

export default AdminLayout;
