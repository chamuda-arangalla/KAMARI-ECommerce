import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Check, Clock, Truck, Package, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderTracking = () => {
  const { orders, updateOrderStatus } = useAdmin();
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || '');
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  const stages = [
    { id: 'Pending',    icon: Clock,    label: 'Pending'    },
    { id: 'Processing', icon: Package,  label: 'Processing' },
    { id: 'Shipped',    icon: Truck,    label: 'Shipped'    },
    { id: 'Delivered',  icon: Check,    label: 'Delivered'  },
  ];

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!newStatus) return;
    updateOrderStatus(selectedOrderId, newStatus, statusNote || `Status updated to ${newStatus}`);
    setNewStatus('');
    setStatusNote('');
  };

  const currentStageIndex = stages.findIndex(s => s.id === selectedOrder?.status);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-[#3b302a]">Order Tracking</h2>
        <p className="text-base text-[#a3948b] mt-2">Monitor and update delivery progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left panel */}
        <div className="lg:col-span-1 space-y-6">

          {/* Order selector */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5ddd5] shadow-sm">
            <h3 className="text-base font-bold text-[#3b302a] uppercase tracking-widest mb-5">Select Order</h3>
            <div className="space-y-3">
              {orders.map(order => (
                <button
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    selectedOrderId === order.id
                      ? 'bg-[#fcfaf7] border-[#c2b2a6] shadow-sm'
                      : 'bg-white border-[#f3ede8] hover:border-[#e5ddd5]'
                  }`}
                >
                  <div className="text-left">
                    <p className="text-base font-semibold text-[#3b302a]">{order.orderNumber}</p>
                    <p className="text-sm text-[#a3948b] mt-0.5">{order.customerName}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Update status */}
          <div className="bg-white p-6 rounded-2xl border border-[#e5ddd5] shadow-sm">
            <h3 className="text-base font-bold text-[#3b302a] uppercase tracking-widest mb-5">Update Status</h3>
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#a3948b] uppercase tracking-wider mb-2">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#f8f5f2] border-none rounded-xl px-4 py-3 text-base focus:ring-1 focus:ring-[#c2b2a6] outline-none"
                  required
                >
                  <option value="">Select Stage</option>
                  {stages.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#a3948b] uppercase tracking-wider mb-2">Note (Optional)</label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="E.g., Out for delivery"
                  className="w-full bg-[#f8f5f2] border-none rounded-xl px-4 py-3 text-base focus:ring-1 focus:ring-[#c2b2a6] outline-none h-28 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-[#3b302a] text-white text-base font-semibold rounded-xl hover:bg-[#2a221d] transition-all"
              >
                Update Timeline
              </button>
            </form>
          </div>
        </div>

        {/* Timeline view */}
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

              {/* Progress bar */}
              <div className="relative mb-20">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#f3ede8] -translate-y-1/2" />
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
                          w-14 h-14 rounded-full flex items-center justify-center z-10 transition-all duration-500
                          ${isCompleted ? 'bg-[#d4a373] text-white' : 'bg-white border-2 border-[#f3ede8] text-[#a3948b]'}
                          ${isCurrent ? 'ring-4 ring-[#d4a373]/20 shadow-lg' : ''}
                        `}>
                          <Icon size={24} />
                        </div>
                        <p className={`mt-3 text-sm font-bold uppercase tracking-wider ${isCompleted ? 'text-[#3b302a]' : 'text-[#a3948b]'}`}>
                          {stage.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* History */}
              <div className="space-y-6">
                <h4 className="text-base font-bold text-[#3b302a] uppercase tracking-widest">History</h4>
                <div className="space-y-6 relative">
                  <div className="absolute left-2.5 top-2 bottom-2 w-px bg-[#f3ede8]" />
                  {[...selectedOrder.trackingTimeline].reverse().map((event, idx) => (
                    <div key={idx} className="relative pl-10">
                      <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-white border-2 border-[#d4a373] z-10" />
                      <div>
                        <p className="text-base font-bold text-[#3b302a]">{event.status}</p>
                        <p className="text-base text-[#6b5e55] mt-1">{event.description}</p>
                        <p className="text-sm text-[#a3948b] mt-1">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 bg-white rounded-2xl border border-dashed border-[#e5ddd5] flex flex-col items-center justify-center text-[#a3948b]">
              <Search size={48} className="mb-4 opacity-20" />
              <p className="text-base">Select an order to view tracking data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
