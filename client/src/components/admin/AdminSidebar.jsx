import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Package,
  Users,
  BarChart3,
  ShoppingBag,
  MapPin,
  X,
  Layers,
  Image,
} from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 ${
        isActive
          ? 'bg-[#e5ddd5] text-[#3b302a] shadow-sm'
          : 'text-[#6b5e55] hover:bg-[#f3ede8] hover:text-[#3b302a]'
      }`
    }
  >
    <Icon size={22} />
    <span>{label}</span>
  </NavLink>
);

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#fcfaf7] border-r border-[#e5ddd5]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10">
            <Link to="/" className="text-3xl font-bold tracking-wider text-[#3b302a] hover:opacity-70 transition-opacity">
              KAMARI
            </Link>
            <button className="lg:hidden" onClick={() => setIsOpen(false)}>
              <X size={26} />
            </button>
          </div>

          <nav className="flex-1 space-y-1.5">
            <SidebarLink to="/admin/orders"      icon={ShoppingBag} label="Orders" />
            <SidebarLink to="/admin/tracking"    icon={MapPin}      label="Order Tracking" />
            <SidebarLink to="/admin/inventory"   icon={Package}     label="Inventory" />
            <SidebarLink to="/admin/customers"   icon={Users}       label="Customers" />
            <SidebarLink to="/admin/analytics"   icon={BarChart3}   label="Analytics" />
            <SidebarLink to="/admin/collections"     icon={Layers}  label="Collections" />
            <SidebarLink to="/admin/home-images"     icon={Image}   label="Home Images" />
          </nav>

          <div className="pt-6 border-t border-[#e5ddd5]">
            <p className="text-sm text-[#a3948b] uppercase tracking-widest font-semibold mb-3">Support</p>
            <p className="text-base text-[#6b5e55]">v1.0.0 Stable</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
