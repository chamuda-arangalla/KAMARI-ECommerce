import { NavLink, Link } from 'react-router-dom';
import {
  Package,
  Users,
  BarChart3,
  ShoppingBag,
  MapPin,
  X,
  Layers,
} from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 ${
        isActive
          ? 'bg-[#d7c9b8] text-[#2c2b28] shadow-sm'
          : 'text-[#5f564d] hover:bg-[#f3ede8] hover:text-[#2c2b28]'
      }`
    }
  >
    <Icon size={22} />
    <span>{label}</span>
  </NavLink>
);

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const closeMobileSidebar = () => setIsOpen(false);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-[min(84vw,16rem)] bg-[#fcfaf7] border-r border-[#d7c9b8]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex h-full flex-col overflow-y-auto p-5 sm:p-6">
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <Link to="/" onClick={closeMobileSidebar} className="text-2xl sm:text-3xl font-bold tracking-wider text-[#2c2b28] hover:opacity-70 transition-opacity">
              KAMARI
            </Link>
            <button className="lg:hidden" onClick={() => setIsOpen(false)}>
              <X size={26} />
            </button>
          </div>

          <nav className="flex-1 space-y-1.5">
            <SidebarLink to="/admin/orders"      icon={ShoppingBag} label="Orders" onClick={closeMobileSidebar} />
            <SidebarLink to="/admin/tracking"    icon={MapPin}      label="Order Tracking" onClick={closeMobileSidebar} />
            <SidebarLink to="/admin/inventory"   icon={Package}     label="Inventory" onClick={closeMobileSidebar} />
            <SidebarLink to="/admin/customers"   icon={Users}       label="Customers" onClick={closeMobileSidebar} />
            <SidebarLink to="/admin/analytics"   icon={BarChart3}   label="Analytics" onClick={closeMobileSidebar} />
            <SidebarLink to="/admin/collections"     icon={Layers}  label="Collections" onClick={closeMobileSidebar} />
          </nav>

          <div className="pt-6 border-t border-[#d7c9b8]">
            <p className="text-sm text-[#8f8376] uppercase tracking-widest font-semibold mb-3">Support</p>
            <p className="text-base text-[#5f564d]">v1.0.0 Stable</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
