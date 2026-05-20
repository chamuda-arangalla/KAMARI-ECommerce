import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Download, Loader2 } from 'lucide-react';
import { useAdmin } from '../../context/useAdmin';

const formatCurrency = (value) => `LKR ${Number(value || 0).toLocaleString()}`;

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Complete: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };
  return (
    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

const OrdersPage = () => {
  const { orders, ordersLoading, ordersError, refreshOrders } = useAdmin();
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const tabs = ['All', 'Pending', 'Complete'];
  const filteredOrders = filter === 'All' ? orders : orders.filter((order) => order.status === filter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-[#3b302a]">Orders</h2>
          <p className="text-[#a3948b] mt-1">Manage and track customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refreshOrders}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e5ddd5] rounded-lg text-[#6b5e55] hover:bg-[#fcfaf7] transition-all"
          >
            <Download size={18} />
            <span>Refresh</span>
          </button>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-white border border-[#e5ddd5] rounded-xl text-base font-medium text-[#6b5e55] hover:bg-[#fcfaf7] transition-all">
          <Download size={20} />
          Export CSV
        </button>
      </div>

      <div className="flex border-b border-[#e5ddd5] gap-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-4 text-base font-medium transition-all relative ${
              filter === tab ? 'text-[#3b302a]' : 'text-[#a3948b] hover:text-[#6b5e55]'
            }`}
          >
            {tab}
            {filter === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b302a]"
              />
            )}
          </button>
        ))}
      </div>

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
              {ordersLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#6b5e55]">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Loading orders...
                    </span>
                  </td>
                </tr>
              )}

              {!ordersLoading && ordersError && (
                <tr>
                  <td colSpan={6} className="px-6 py-8">
                    <p className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                      {ordersError}
                    </p>
                  </td>
                </tr>
              )}

              {!ordersLoading && !ordersError && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#a3948b]">
                    No orders found.
                  </td>
                </tr>
              )}

              {!ordersLoading && !ordersError && filteredOrders.map((order) => (
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
                  <td className="px-6 py-4 font-semibold text-[#3b302a]">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
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

      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl overflow-y-auto"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-[#3b302a]">Order Details</h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-[#f8f5f2] rounded-full text-[#6b5e55]"
                  >
                    <ChevronRight size={24} />
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
                      <div key={`${item.name}-${idx}`} className="py-4 flex justify-between gap-4">
                        <div>
                          <p className="text-[#3b302a] font-medium">{item.name}</p>
                          <p className="text-sm text-[#a3948b]">
                            {item.colour} · Size {item.size} · Qty: {item.quantity} x {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="font-semibold text-[#3b302a] whitespace-nowrap">
                          {formatCurrency(item.quantity * item.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-[#e5ddd5] flex justify-between items-center">
                    <p className="text-lg font-semibold text-[#3b302a]">Total</p>
                    <p className="text-2xl font-bold text-[#3b302a]">
                      {formatCurrency(selectedOrder.totalAmount)}
                    </p>
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
