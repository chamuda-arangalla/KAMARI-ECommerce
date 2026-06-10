import { useState } from 'react';
import { Check, ChevronRight, Clock, Loader2, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAdmin } from '../../context/useAdmin';

const stages = [
  { id: 'Created', icon: Clock, label: 'Created' },
  { id: 'Shipping', icon: ChevronRight, label: 'Shipping' },
  { id: 'Received', icon: Check, label: 'Received' },
];

const TrackingDetails = ({ selectedOrder, currentStageIndex, compact = false }) => (
  <div className={`rounded-2xl border border-[#d7c9b8] bg-white shadow-sm ${compact ? 'p-5' : 'p-6 sm:p-8'}`}>
    <div className={`${compact ? 'mb-8' : 'mb-12'} flex flex-col justify-between gap-4 sm:flex-row sm:items-start`}>
      <div>
        <h3 className={`${compact ? 'text-xl' : 'text-2xl'} font-bold text-[#2c2b28]`}>
          Live Tracking: {selectedOrder.orderNumber}
        </h3>
        <p className="mt-1 text-sm text-[#8f8376] sm:text-base">Customer: {selectedOrder.customerName}</p>
      </div>
      <span className="w-fit rounded-full border border-[#d7c9b8] bg-[#fcfaf7] px-4 py-2 text-sm font-semibold text-[#2c2b28] sm:text-base">
        {selectedOrder.orderStatus}
      </span>
    </div>

    <div className={`${compact ? 'mb-10' : 'mb-20'} overflow-x-auto pb-2`}>
      <div className="relative min-w-[360px] sm:min-w-0">
        <div className="absolute left-0 right-0 top-7 h-1 bg-[#f3ede8]" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
          className="absolute left-0 top-7 h-1 bg-[#d4a373]"
        />
        <div className="relative flex justify-between">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div key={stage.id} className="flex flex-col items-center">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 sm:h-14 sm:w-14 ${
                  isCompleted ? 'bg-[#d4a373] text-white' : 'border-2 border-[#f3ede8] bg-white text-[#8f8376]'
                } ${isCurrent ? 'shadow-lg ring-4 ring-[#d4a373]/20' : ''}`}
                >
                  <Icon size={compact ? 18 : 22} />
                </div>
                <p className={`mt-3 text-xs font-bold uppercase tracking-wider sm:text-sm ${isCompleted ? 'text-[#2c2b28]' : 'text-[#8f8376]'}`}>
                  {stage.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>

    <div className="space-y-6">
      <h4 className="text-sm font-semibold uppercase tracking-widest text-[#2c2b28]">History</h4>
      <div className="relative max-h-[280px] space-y-6 overflow-y-auto pr-2">
        <div className="absolute bottom-2 left-2.5 top-2 w-px bg-[#f3ede8]" />
        {[...selectedOrder.trackingTimeline].reverse().map((event, idx) => (
          <div key={`${event.status}-${idx}`} className="relative pl-10">
            <div className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full border-2 border-[#d4a373] bg-white" />
            <div>
              <p className="text-base font-bold text-[#2c2b28]">{event.status}</p>
              <p className="mt-1 text-sm text-[#5f564d] sm:text-base">{event.description}</p>
              <p className="mt-1 text-sm text-[#8f8376]">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

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
  const currentStageIndex = Math.max(
    stages.findIndex((stage) => stage.id === selectedOrder?.orderStatus),
    0,
  );

  const handleSelectOrder = (order) => {
    setSelectedOrderId(order.id);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-[#2c2b28]">Order Tracking</h2>
        <p className="mt-1 text-[#8f8376]">Monitor order progress</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-2xl border border-[#d7c9b8] bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-base font-bold uppercase tracking-widest text-[#2c2b28]">Select Order</h3>

            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8376]" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search orders"
                className="w-full rounded-xl border border-[#d7c9b8] bg-[#fcfaf7] py-3 pl-10 pr-4 text-sm text-[#2c2b28] outline-none transition-all placeholder:text-[#b8ada5] focus:border-[#c2b2a6] focus:bg-white"
              />
            </div>

            <div className="space-y-3">
              {ordersLoading && (
                <div className="flex items-center gap-2 py-8 text-sm text-[#5f564d]">
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
                <p className="py-10 text-sm text-[#8f8376]">No orders found.</p>
              )}

              {!ordersLoading && !ordersError && orders.length > 0 && filteredOrders.length === 0 && (
                <p className="py-10 text-sm text-[#8f8376]">No matching orders.</p>
              )}

              {!ordersLoading && !ordersError && filteredOrders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => handleSelectOrder(order)}
                  className={`group flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all ${
                    selectedOrderId === order.id
                      ? 'border-[#c2b2a6] bg-[#fcfaf7]'
                      : 'border-[#f0ebe5] bg-white hover:border-[#c2b2a6] hover:bg-[#fcfaf7]'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-base font-bold text-[#2c2b28]">{order.orderNumber}</span>
                    <span className="mt-1 block truncate text-sm font-medium text-[#5f564d]">{order.customerName}</span>
                    <span className="mt-1 block text-xs text-[#8f8376]">{order.date}</span>
                  </span>
                  <ChevronRight size={18} className="shrink-0 text-[#8f8376] transition-colors group-hover:text-[#2c2b28]" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden space-y-6 lg:col-span-2 lg:block">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
              >
                <TrackingDetails selectedOrder={selectedOrder} currentStageIndex={currentStageIndex} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-dashed border-[#d7c9b8] bg-white p-12 text-center text-[#8f8376]"
              >
                Select an order to view its tracking timeline.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-[#2c2b28]/35 backdrop-blur-sm"
              onClick={() => setSelectedOrderId('')}
            />
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: 'spring', damping: 24, stiffness: 240 }}
              className="fixed inset-x-3 bottom-3 top-20 z-[90] overflow-y-auto rounded-2xl bg-[#eae0d6] p-3 shadow-2xl"
            >
              <div className="mb-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedOrderId('')}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#5f564d] shadow-sm"
                  aria-label="Close tracking details"
                >
                  <X size={18} />
                </button>
              </div>
              <TrackingDetails
                selectedOrder={selectedOrder}
                currentStageIndex={currentStageIndex}
                compact
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderTracking;
