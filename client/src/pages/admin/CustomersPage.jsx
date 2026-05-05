import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Search, Mail, Phone, ShoppingBag, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomersPage = () => {
  const { customers, orders } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-[#3b302a]">Customers</h2>
          <p className="text-[#a3948b] mt-1">Review customer profiles and order history</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3948b]" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border border-[#e5ddd5] rounded-xl text-sm w-full md:w-72 focus:ring-1 focus:ring-[#c2b2a6] outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5ddd5] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fcfaf7] border-b border-[#e5ddd5]">
                <th className="px-6 py-4 text-xs font-semibold text-[#a3948b] uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#a3948b] uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#a3948b] uppercase tracking-wider text-center">Total Orders</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#a3948b] uppercase tracking-wider">Last Order</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3ede8]">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-[#fcfaf7] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f3ede8] flex items-center justify-center text-[#3b302a] font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="font-medium text-[#3b302a]">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-[#6b5e55]">
                        <Mail size={14} className="text-[#a3948b]" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#6b5e55]">
                        <Phone size={14} className="text-[#a3948b]" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 bg-[#fcfaf7] border border-[#e5ddd5] rounded-lg font-semibold text-[#3b302a]">
                      {customer.totalOrders}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#6b5e55]">{customer.lastOrderDate}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedCustomer(customer)}
                      className="p-2 text-[#a3948b] hover:text-[#3b302a] hover:bg-[#f3ede8] rounded-lg transition-all"
                    >
                      <ExternalLink size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedCustomer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
              onClick={() => setSelectedCustomer(null)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-white z-[70] shadow-2xl overflow-y-auto"
            >
              <div className="p-8 space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-[#3b302a]">Customer Profile</h3>
                  <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-[#f8f5f2] rounded-full">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex items-center gap-6 p-8 bg-[#fcfaf7] rounded-3xl border border-[#e5ddd5]">
                  <div className="w-20 h-20 rounded-full bg-[#3b302a] flex items-center justify-center text-white text-3xl font-bold">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-2xl font-semibold text-[#3b302a]">{selectedCustomer.name}</h4>
                    <p className="text-[#a3948b]">{selectedCustomer.email}</p>
                    <div className="flex gap-4 mt-3">
                      <span className="text-xs font-semibold px-3 py-1 bg-white border border-[#e5ddd5] rounded-full text-[#6b5e55]">
                        ID: {selectedCustomer.id}
                      </span>
                      <span className="text-xs font-semibold px-3 py-1 bg-white border border-[#e5ddd5] rounded-full text-[#6b5e55]">
                        Joined Jan 2024
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white border border-[#e5ddd5] rounded-2xl">
                    <p className="text-xs text-[#a3948b] uppercase tracking-widest font-bold mb-2">Total Revenue</p>
                    <p className="text-2xl font-bold text-[#3b302a]">$1,240.00</p>
                  </div>
                  <div className="p-6 bg-white border border-[#e5ddd5] rounded-2xl">
                    <p className="text-xs text-[#a3948b] uppercase tracking-widest font-bold mb-2">Success Rate</p>
                    <p className="text-2xl font-bold text-emerald-600">100%</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-[#3b302a] flex items-center gap-2">
                    <ShoppingBag size={20} /> Order History
                  </h4>
                  <div className="space-y-4">
                    {selectedCustomer.orderHistory.map((orderNum, idx) => {
                      const orderDetails = orders.find(o => o.orderNumber === orderNum);
                      return (
                        <div key={idx} className="p-5 bg-white border border-[#f3ede8] rounded-xl flex items-center justify-between hover:border-[#e5ddd5] transition-all cursor-pointer">
                          <div>
                            <p className="font-semibold text-[#3b302a]">{orderNum}</p>
                            <p className="text-sm text-[#a3948b]">{orderDetails?.date || 'N/A'}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#3b302a]">${orderDetails?.totalAmount || '0'}</p>
                            <p className="text-xs text-emerald-600 font-medium">Completed</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomersPage;
