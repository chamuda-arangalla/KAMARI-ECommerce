import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { ChevronRight, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatusBadge = ({ status }) => {
  const styles = {
    Pending:    'bg-amber-100 text-amber-700 border-amber-200',
    Processing: 'bg-blue-100 text-blue-700 border-blue-200',
    Shipped:    'bg-purple-100 text-purple-700 border-purple-200',
    Delivered:  'bg-emerald-100 text-emerald-700 border-emerald-200',
  };
  return (
    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

const OrdersPage = () => {
  const { orders } = useAdmin();
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered'];
  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-[#3b302a]">Orders</h2>
          <p className="text-base text-[#a3948b] mt-2">Manage and track customer orders</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-white border border-[#e5ddd5] rounded-xl text-base font-medium text-[#6b5e55] hover:bg-[#fcfaf7] transition-all">
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e5ddd5] gap-8">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-4 text-base font-medium transition-all relative ${
              filter === tab ? 'text-[#3b302a]' : 'text-[#a3948b] hover:text-[#6b5e55]'
            }`}
          >
            {tab}
            {filter === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b302a]" />
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#e5ddd5] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fcfaf7] border-b border-[#e5ddd5]">
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Order</th>
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Customer</th>
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Items</th>
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Total</th>
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Status</th>
                <th className="px-6 py-5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3ede8]">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-[#fcfaf7] transition-colors cursor-pointer group"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="text-base font-semibold text-[#3b302a]">{order.orderNumber}</span>
                    <div className="text-sm text-[#a3948b] mt-0.5">{order.date}</div>
                  </td>
                  <td className="px-6 py-5 text-base text-[#6b5e55]">{order.customerName}</td>
                  <td className="px-6 py-5 text-base text-[#6b5e55]">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </td>
                  <td className="px-6 py-5 text-base font-semibold text-[#3b302a]">${order.totalAmount}</td>
                  <td className="px-6 py-5"><StatusBadge status={order.status} /></td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-[#a3948b] group-hover:text-[#3b302a] transition-all">
                      <ChevronRight size={22} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl overflow-y-auto"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-[#3b302a]">Order Details</h3>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-[#f8f5f2] rounded-full text-[#6b5e55]">
                    <ChevronRight size={26} />
                  </button>
                </div>

                <div className="bg-[#fcfaf7] p-6 rounded-2xl border border-[#e5ddd5] space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-[#a3948b] uppercase tracking-widest font-bold mb-1">Order Number</p>
                      <p className="text-xl font-bold text-[#3b302a]">{selectedOrder.orderNumber}</p>
                    </div>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  <div>
                    <p className="text-sm text-[#a3948b] uppercase tracking-widest font-bold mb-1">Placed On</p>
                    <p className="text-base text-[#6b5e55]">{selectedOrder.date}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base font-bold text-[#3b302a] uppercase tracking-widest">Customer Info</h4>
                  <p className="text-base font-semibold text-[#3b302a]">{selectedOrder.customerName}</p>
                  <p className="text-base text-[#6b5e55] leading-relaxed">{selectedOrder.deliveryAddress}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base font-bold text-[#3b302a] uppercase tracking-widest">Order Items</h4>
                  <div className="divide-y divide-[#f3ede8]">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="py-4 flex justify-between">
                        <div>
                          <p className="text-base font-semibold text-[#3b302a]">{item.name}</p>
                          <p className="text-sm text-[#a3948b] mt-0.5">Qty: {item.quantity} × ${item.price}</p>
                        </div>
                        <p className="text-base font-bold text-[#3b302a]">${item.quantity * item.price}</p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-[#e5ddd5] flex justify-between items-center">
                    <p className="text-lg font-semibold text-[#3b302a]">Total</p>
                    <p className="text-2xl font-bold text-[#3b302a]">${selectedOrder.totalAmount}</p>
                  </div>
                </div>

                <button className="w-full py-4 bg-[#3b302a] text-white text-base font-semibold rounded-xl hover:bg-[#2a221d] transition-all shadow-lg shadow-[#3b302a]/10">
                  Print Invoice
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersPage;
