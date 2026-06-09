import { LogOut, Bell, Search, Menu } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../common/ConfirmDialog';
import { logoutAdmin } from '../../services/authApi';

const AdminHeader = ({ setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const admin = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const displayName = [admin.firstName, admin.lastName].filter(Boolean).join(' ') || admin.username || 'Admin';
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logoutAdmin();
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setLogoutOpen(false);
      setLoggingOut(false);
      navigate('/admin/login', { replace: true });
    }
  };

  return (
    <>
      <header className="h-16 sm:h-20 bg-white/80 backdrop-blur-md border-b border-[#e5ddd5] sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open admin navigation"
            className="p-2 lg:hidden text-[#6b5e55] hover:bg-[#f8f5f2] rounded-md transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3948b]" size={20} />
            <input
              type="text"
              placeholder="Search dashboard..."
              className="pl-11 pr-4 py-2.5 bg-[#f8f5f2] border-none rounded-full text-base w-72 focus:ring-1 focus:ring-[#c2b2a6] outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-6">
          <button className="relative text-[#6b5e55] hover:text-[#3b302a] transition-colors">
            <Bell size={21} className="sm:h-6 sm:w-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#d4a373] rounded-full border-2 border-white" />
          </button>

          <div className="hidden h-8 w-px bg-[#e5ddd5] sm:block" />

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-base font-semibold text-[#3b302a]">{displayName}</p>
              <p className="text-sm text-[#a3948b]">Administrator</p>
            </div>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#e5ddd5] flex items-center justify-center text-[#3b302a] text-sm sm:text-base font-bold border-2 border-[#f8f5f2] shadow-sm">
              {initials}
            </div>
            <button
              onClick={() => setLogoutOpen(true)}
              aria-label="Sign out"
              className="p-2 text-[#6b5e55] hover:text-[#3b302a] hover:bg-[#f8f5f2] rounded-full transition-all"
            >
              <LogOut size={20} className="sm:h-[22px] sm:w-[22px]" />
            </button>
          </div>
        </div>
      </header>

      <ConfirmDialog
        isOpen={logoutOpen}
        title="Sign out?"
        message="You will leave the admin dashboard and need to sign in again to manage products."
        confirmLabel="Sign Out"
        type="logout"
        loading={loggingOut}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default AdminHeader;
