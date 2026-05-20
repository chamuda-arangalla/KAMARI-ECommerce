import { useState } from 'react';
import { Check, ChevronRight, Clock, Loader2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdmin } from '../../context/useAdmin';

const OrderTracking = () => {
  const { orders, ordersLoading, ordersError, updateOrderStatus } = useAdmin();
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const activeOrderId = selectedOrderId || orders[0]?.id || '';
  const selectedOrder = orders.find((order) => order.id === activeOrderId);

  const stages = [
    { id: 'Pending', icon: Clock, label: 'Pending' },
    { id: 'Complete', icon: Check, label: 'Complete' },
  ];

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!newStatus) return;
    updateOrderStatus(activeOrderId, newStatus, statusNote || `Status updated to ${newStatus}`);
    setNewStatus('');
    setStatusNote('');
  };

  const currentStageIndex = Math.max(
    stages.findIndex((stage) => stage.id === selectedOrder?.status),
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
          <div className="bg-white p-6 rounded-2xl border border-[#e5ddd5] shadow-sm">
            <h3 className="text-sm font-semibold text-[#3b302a] uppercase tracking-widest mb-4">Select Order</h3>
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
                <p className="py-8 text-sm text-[#a3948b]">No orders found.</p>
              )}

              {!ordersLoading && !ordersError && orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    activeOrderId === order.id
                      ? 'bg-[#fcfaf7] border-[#c2b2a6] shadow-sm'
                      : 'bg-white border-[#f3ede8] hover:border-[#e5ddd5]'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-medium text-[#3b302a]">{order.orderNumber}</p>
                    <p className="text-xs text-[#a3948b]">{order.customerName}</p>
                  </div>
                  <ChevronRight size={18} className={activeOrderId === order.id ? 'text-[#3b302a]' : 'text-[#a3948b]'} />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e5ddd5] shadow-sm">
            <h3 className="text-sm font-semibold text-[#3b302a] uppercase tracking-widest mb-4">Update Status</h3>
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#a3948b] uppercase mb-1.5">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#f8f5f2] border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#c2b2a6] outline-none"
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
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedOrder ? (
            <div className="bg-white p-8 rounded-2xl border border-[#e5ddd5] shadow-sm">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="text-xl font-semibold text-[#3b302a]">Live Tracking: {selectedOrder.orderNumber}</h3>
                  <p className="text-[#a3948b] text-sm">Customer: {selectedOrder.customerName}</p>
                </div>
                <span className="px-4 py-1.5 bg-[#fcfaf7] border border-[#e5ddd5] rounded-full text-sm font-medium text-[#3b302a]">
                  Current: {selectedOrder.status}
                </span>
              </div>

              <div className="relative mb-20">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#f3ede8] -translate-y-1/2"></div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
                  className="absolute top-1/2 left-0 h-1 bg-[#d4a373] -translate-y-1/2"
                />

                <div className="relative flex justify-between">
                  {stages.map((stage, idx) => {
                    const Icon = stage.icon;
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div key={stage.id} className="flex flex-col items-center">
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-500
                          ${isCompleted ? 'bg-[#d4a373] text-white' : 'bg-white border-2 border-[#f3ede8] text-[#a3948b]'}
                          ${isCurrent ? 'ring-4 ring-[#d4a373]/20 shadow-lg' : ''}
                        `}>
                          <Icon size={20} />
                        </div>
                        <p className={`mt-3 text-xs font-semibold uppercase tracking-wider ${isCompleted ? 'text-[#3b302a]' : 'text-[#a3948b]'}`}>
                          {stage.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-sm font-semibold text-[#3b302a] uppercase tracking-widest">History</h4>
                <div className="space-y-6 relative">
                  <div className="absolute left-2.5 top-2 bottom-2 w-px bg-[#f3ede8]"></div>
                  {[...selectedOrder.trackingTimeline].reverse().map((event, idx) => (
                    <div key={`${event.status}-${idx}`} className="relative pl-10">
                      <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-white border-2 border-[#d4a373] z-10"></div>
                      <div>
                        <p className="text-[#3b302a] font-semibold">{event.status}</p>
                        <p className="text-sm text-[#6b5e55] mt-1">{event.description}</p>
                        <p className="text-xs text-[#a3948b] mt-1.5">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 bg-white rounded-2xl border border-dashed border-[#e5ddd5] flex flex-col items-center justify-center text-[#a3948b]">
              <Search size={48} className="mb-4 opacity-20" />
              <p>Select an order to view tracking data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
