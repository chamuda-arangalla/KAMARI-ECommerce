import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { AdminProvider } from '../../context/AdminContext';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const fixedScreenPaths = [
    '/admin/orders',
    '/admin/inventory',
    '/admin/customers',
    '/admin/tracking',
  ];
  const isFixedScreenPage = fixedScreenPaths.includes(pathname);

  return (
    <AdminProvider>
      <div
        className={`min-h-screen bg-[#eae0d6] ${isFixedScreenPage ? 'lg:h-screen lg:overflow-hidden' : ''}`}
        style={{ fontFamily: 'var(--kamari-font-body)' }}
      >
        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        <div className={`lg:pl-64 flex min-h-screen flex-col transition-all duration-300 ${isFixedScreenPage ? 'lg:h-screen' : ''}`}>
          <AdminHeader setIsSidebarOpen={setIsSidebarOpen} />
          
          <main className={`flex-1 px-4 py-5 sm:px-6 md:p-10 ${isFixedScreenPage ? 'lg:min-h-0 lg:overflow-hidden lg:p-6' : ''}`}>
            <div className={`max-w-7xl mx-auto min-w-0 ${isFixedScreenPage ? 'lg:h-full' : ''}`}>
              <Outlet />
            </div>
          </main>
          
          {!isFixedScreenPage && (
            <footer className="px-4 py-6 text-center text-[#8f8376] text-xs sm:text-sm">
              &copy; 2024 KAMARI Admin Portal. All rights reserved.
            </footer>
          )}
        </div>
      </div>
    </AdminProvider>
  );
};

export default AdminLayout;
