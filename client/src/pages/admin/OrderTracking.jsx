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
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#3b302a]">Order Tracking</h2>
          <p className="text-[#a3948b] mt-1">Monitor order progress</p>
        </div>
        <span className="inline-flex w-fit rounded-full border border-[#e5ddd5] bg-white px-4 py-2 text-sm font-semibold text-[#6b5e55]">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </span>
      </div>

      <div className="rounded-2xl border border-[#e5ddd5] bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#3b302a] uppercase tracking-widest">Orders</h3>
            <p className="mt-1 text-sm text-[#a3948b]">{filteredOrders.length} shown</p>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3948b]" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search order or customer"
              className="w-full rounded-xl border border-[#e5ddd5] bg-[#fcfaf7] py-3 pl-10 pr-4 text-sm text-[#3b302a] outline-none transition-all placeholder:text-[#b8ada5] focus:border-[#c2b2a6] focus:bg-white"
            />
          </div>
        </div>

        {ordersLoading && (
          <div className="flex items-center gap-2 py-12 text-sm text-[#6b5e55]">
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

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#fcfaf7] border border-[#e5ddd5] px-3 py-1 text-[11px] font-semibold text-[#3b302a]">
                    {order.orderStatus}
                  </span>
                  <span className="rounded-full bg-[#f8f5f2] border border-[#e5ddd5] px-3 py-1 text-[11px] font-semibold text-[#6b5e55]">
                    Payment: {order.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/30 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrderId('')}
          >
            <motion.div
              className="w-full max-w-4xl rounded-2xl border border-[#e5ddd5] bg-white p-5 shadow-2xl sm:p-8"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: 'spring', damping: 24, stiffness: 260 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a3948b]">Order Tracking</p>
                  <h3 className="mt-2 break-words text-xl sm:text-2xl font-bold text-[#3b302a]">
                    {selectedOrder.orderNumber}
                  </h3>
                  <p className="text-base text-[#a3948b] mt-1">Customer: {selectedOrder.customerName}</p>
                </div>

                <div className="flex items-start justify-between gap-3 sm:flex-col sm:items-end">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderId('')}
                    className="order-2 rounded-full border border-[#e5ddd5] p-2 text-[#6b5e55] transition-all hover:bg-[#f8f5f2] sm:order-1"
                    aria-label="Close tracking popup"
                  >
                    <X size={18} />
                  </button>
                  <div className="order-1 flex flex-wrap gap-2 sm:order-2 sm:justify-end">
                    <span className="px-4 py-2 bg-[#fcfaf7] border border-[#e5ddd5] rounded-full text-sm sm:text-base font-semibold text-[#3b302a]">
                      Order: {selectedOrder.orderStatus}
                    </span>
                    <span className="px-4 py-2 bg-[#f8f5f2] border border-[#e5ddd5] rounded-full text-sm font-semibold text-[#6b5e55]">
                      Payment: {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative mb-14 overflow-x-auto pb-3 sm:mb-16 sm:overflow-visible sm:pb-0">
                <div className="absolute left-8 right-8 top-7 h-1 min-w-[480px] bg-[#f3ede8] sm:left-0 sm:right-0 sm:top-1/2 sm:min-w-0 sm:-translate-y-1/2" />
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

              <div className="space-y-6">
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
