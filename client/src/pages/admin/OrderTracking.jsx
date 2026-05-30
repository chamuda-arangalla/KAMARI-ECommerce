import { useState } from 'react';
import { Check, ChevronRight, Clock, Loader2, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAdmin } from '../../context/useAdmin';

const OrderTracking = () => {
  const { orders, ordersLoading, ordersError } = useAdmin();
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter((order) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    return [
      order.orderNumber,
      order.customerName,
      order.orderStatus,
      order.status,
    ].some((value) => String(value || '').toLowerCase().includes(query));
  });

  const selectedOrder = orders.find((order) => order.id === selectedOrderId);

  const stages = [
    { id: 'Created', icon: Clock, label: 'Created' },
    { id: 'Shipping', icon: ChevronRight, label: 'Shipping' },
    { id: 'Received', icon: Check, label: 'Received' },
  ];

  const currentStageIndex = Math.max(
    stages.findIndex((stage) => stage.id === selectedOrder?.orderStatus),
    0,
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-[#3b302a]">Order Tracking</h2>
        <p className="text-[#a3948b] mt-1">Monitor and update order progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">

          {/* Order selector */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5ddd5] shadow-sm">
            <h3 className="text-base font-bold text-[#3b302a] uppercase tracking-widest mb-5">Select Order</h3>
            <div className="space-y-3">
              {ordersLoading && (
                <div className="flex items-center gap-2 py-8 text-sm text-[#6b5e55]">
                  <Loader2 size={16} className="animate-spin" />
                  Loading orders...
                </div>
              )}

        {!ordersLoading && ordersError && (
          <p className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {ordersError}
          </p>
        )}

        {!ordersLoading && !ordersError && orders.length === 0 && (
          <p className="py-12 text-sm text-[#a3948b]">No orders found.</p>
        )}

        {!ordersLoading && !ordersError && orders.length > 0 && filteredOrders.length === 0 && (
          <p className="py-12 text-sm text-[#a3948b]">No matching orders.</p>
        )}

        {!ordersLoading && !ordersError && filteredOrders.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filteredOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => setSelectedOrderId(order.id)}
                className="group flex min-h-[168px] flex-col justify-between rounded-2xl border border-[#f0ebe5] bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#c2b2a6] hover:shadow-md"
              >
                <div className="min-w-0">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <p className="truncate text-base font-bold text-[#3b302a]">{order.orderNumber}</p>
                    <ChevronRight size={18} className="shrink-0 text-[#a3948b] transition-colors group-hover:text-[#3b302a]" />
                  </div>
                  <p className="truncate text-sm font-medium text-[#6b5e55]">{order.customerName}</p>
                  <p className="mt-1 text-xs text-[#a3948b]">{order.date}</p>
                </div>

          {/* Update status */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5ddd5] shadow-sm">
            <h3 className="text-base font-bold text-[#3b302a] uppercase tracking-widest mb-5">Update Status</h3>
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#a3948b] uppercase mb-1.5">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#f8f5f2] border-none rounded-xl px-4 py-3 text-base focus:ring-1 focus:ring-[#c2b2a6] outline-none"
                  required
                  disabled={!selectedOrder}
                >
                  <option value="">Select Stage</option>
                  {stages.map((stage) => (
                    <option key={stage.id} value={stage.id}>{stage.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#a3948b] uppercase mb-1.5">Note (Optional)</label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="E.g., Payment completed"
                  className="w-full bg-[#f8f5f2] border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#c2b2a6] outline-none h-24 resize-none"
                  disabled={!selectedOrder}
                />
              </div>
              <button
                type="submit"
                disabled={!selectedOrder}
                className="w-full py-3 bg-[#3b302a] text-white rounded-lg font-medium hover:bg-[#2a221d] transition-all disabled:opacity-60"
              >
                Update Timeline
              </button>
            ))}
          </div>
        )}
      </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedOrder ? (
            <div className="bg-white p-8 rounded-2xl border border-[#e5ddd5] shadow-sm">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="text-2xl font-bold text-[#3b302a]">Live Tracking: {selectedOrder.orderNumber}</h3>
                  <p className="text-base text-[#a3948b] mt-1">Customer: {selectedOrder.customerName}</p>
                </div>
                <span className="px-4 py-2 bg-[#fcfaf7] border border-[#e5ddd5] rounded-full text-base font-semibold text-[#3b302a]">
                  {selectedOrder.status}
                </span>
              </div>

              <div className="relative mb-20">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#f3ede8] -translate-y-1/2"></div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
                  className="absolute left-8 top-7 h-1 bg-[#d4a373] sm:left-0 sm:top-1/2 sm:-translate-y-1/2"
                />
                <div className="relative flex min-w-[520px] justify-between sm:min-w-0">
                  {stages.map((stage, idx) => {
                    const Icon = stage.icon;
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    return (
                      <div key={stage.id} className="flex flex-col items-center">
                        <div className={`
                          w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center z-10 transition-all duration-500
                          ${isCompleted ? 'bg-[#d4a373] text-white' : 'bg-white border-2 border-[#f3ede8] text-[#a3948b]'}
                          ${isCurrent ? 'ring-4 ring-[#d4a373]/20 shadow-lg' : ''}
                        `}>
                          <Icon size={22} />
                        </div>
                        <p className={`mt-3 text-sm font-bold uppercase tracking-wider ${isCompleted ? 'text-[#3b302a]' : 'text-[#a3948b]'}`}>
                          {stage.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-sm font-semibold text-[#3b302a] uppercase tracking-widest">History</h4>
                <div className="relative max-h-[280px] space-y-6 overflow-y-auto pr-2">
                  <div className="absolute left-2.5 top-2 bottom-2 w-px bg-[#f3ede8]" />
                  {[...selectedOrder.trackingTimeline].reverse().map((event, idx) => (
                    <div key={`${event.status}-${idx}`} className="relative pl-10">
                      <div className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full border-2 border-[#d4a373] bg-white" />
                      <div>
                        <p className="text-base font-bold text-[#3b302a]">{event.status}</p>
                        <p className="text-base text-[#6b5e55] mt-1">{event.description}</p>
                        <p className="text-sm text-[#a3948b] mt-1">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderTracking;
