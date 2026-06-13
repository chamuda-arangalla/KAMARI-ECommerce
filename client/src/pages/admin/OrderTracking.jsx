import { useEffect, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Clock, Loader2, MapPin, Phone, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAdmin } from '../../context/useAdmin';

const PAGE_SIZE = 6;

const stages = [
  { id: 'Created', icon: Clock, label: 'Created' },
  { id: 'Shipping', icon: ChevronRight, label: 'Shipping' },
  { id: 'Received', icon: Check, label: 'Received' },
];

const TrackingDetails = ({ selectedOrder, currentStageIndex }) => (
  <div className="flex h-full min-h-0 flex-col rounded-2xl border border-[#d7c9b8] bg-white p-5 sm:p-6">
    <div className="mb-5 flex shrink-0 flex-col justify-between gap-3 sm:flex-row sm:items-start">
      <div>
        <h3 className="text-xl font-bold text-[#2c2b28] sm:text-2xl">
          Live Tracking: {selectedOrder.orderNumber}
        </h3>
        <p className="mt-1 text-sm text-[#8f8376]">Customer: {selectedOrder.customerName}</p>
      </div>
      <span className="w-fit rounded-full border border-[#d7c9b8] bg-[#fcfaf7] px-4 py-2 text-sm font-semibold text-[#2c2b28]">
        {selectedOrder.orderStatus}
      </span>
    </div>

    <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="flex min-h-0 flex-col gap-4">
        <div className="grid shrink-0 gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[#eee6de] bg-[#fcfaf7] p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8f8376]">
              <MapPin size={15} />
              Delivery Address
            </div>
            <p className="text-sm leading-5 text-[#5f564d]">
              {selectedOrder.deliveryAddress || 'Delivery address not available'}
            </p>
          </div>

          <div className="rounded-xl border border-[#eee6de] bg-[#fcfaf7] p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8f8376]">
              <Phone size={15} />
              Contact Number
            </div>
            <p className="text-sm font-medium text-[#5f564d]">
              {selectedOrder.raw?.receiverDetails?.phoneNumber || 'Contact number not available'}
            </p>
            {selectedOrder.raw?.receiverDetails?.secondaryPhoneNumber && (
              <p className="mt-1 text-xs text-[#8f8376]">
                Alternative: {selectedOrder.raw.receiverDetails.secondaryPhoneNumber}
              </p>
            )}
          </div>
        </div>

        <div className="flex min-h-0 flex-1 items-center rounded-xl border border-[#eee6de] bg-[#fcfaf7] px-5 py-5">
          <div className="relative w-full min-w-0">
            <div className="absolute left-0 right-0 top-6 h-1 bg-[#f3ede8]" />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
              className="absolute left-0 top-6 h-1 bg-[#d4a373]"
            />
            <div className="relative flex justify-between">
              {stages.map((stage, idx) => {
                const Icon = stage.icon;
                const isCompleted = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div key={stage.id} className="flex flex-col items-center">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-[#d4a373] text-white' : 'border-2 border-[#f3ede8] bg-white text-[#8f8376]'
                    } ${isCurrent ? 'shadow-lg ring-4 ring-[#d4a373]/20' : ''}`}
                    >
                      <Icon size={19} />
                    </div>
                    <p className={`mt-2 text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-[#2c2b28]' : 'text-[#8f8376]'}`}>
                      {stage.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 rounded-xl border border-[#eee6de] bg-[#fcfaf7] p-5">
        <h4 className="mb-5 text-sm font-semibold uppercase tracking-widest text-[#2c2b28]">History</h4>
        <div className="relative space-y-5">
        <div className="absolute bottom-2 left-2.5 top-2 w-px bg-[#f3ede8]" />
        {[...selectedOrder.trackingTimeline].reverse().map((event, idx) => (
          <div key={`${event.status}-${idx}`} className="relative pl-10">
            <div className="absolute left-0 top-1 z-10 h-5 w-5 rounded-full border-2 border-[#d4a373] bg-white" />
            <div>
              <p className="text-sm font-bold text-[#2c2b28]">{event.status}</p>
              <p className="mt-1 text-sm text-[#5f564d]">{event.description}</p>
              <p className="mt-1 text-xs text-[#8f8376]">{event.date}</p>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  </div>
);

const OrderTracking = () => {
  const { orders, ordersLoading, ordersError } = useAdmin();
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedOrders = filteredOrders.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const firstVisibleOrder = filteredOrders.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const lastVisibleOrder = Math.min(safePage * PAGE_SIZE, filteredOrders.length);

  const selectedOrder = orders.find((order) => order.id === selectedOrderId);
  const currentStageIndex = Math.max(
    stages.findIndex((stage) => stage.id === selectedOrder?.orderStatus),
    0,
  );

  const handleSelectOrder = (order) => {
    setSelectedOrderId(order.id);
  };

  useEffect(() => {
    if (!selectedOrder) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedOrderId('');
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedOrder]);

  return (
    <div className="space-y-8 lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:space-y-0">
      <div>
        <h2 className="text-3xl font-semibold text-[#2c2b28]">Order Tracking</h2>
        <p className="mt-1 text-[#8f8376]">Monitor order progress</p>
      </div>

      <div className="w-full lg:mt-4 lg:min-h-0 lg:flex-1">
        <div className="space-y-6 lg:h-full">
          <div className="rounded-2xl border border-[#d7c9b8] bg-white p-6 shadow-sm lg:flex lg:h-full lg:min-h-0 lg:flex-col lg:p-5">
            <h3 className="mb-5 text-base font-bold uppercase tracking-widest text-[#2c2b28] lg:mb-3">Select Order</h3>

            <div className="relative mb-4 lg:mb-3">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8f8376]" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search orders"
                className="w-full rounded-xl border border-[#d7c9b8] bg-[#fcfaf7] py-3 pl-10 pr-4 text-sm text-[#2c2b28] outline-none transition-all placeholder:text-[#b8ada5] focus:border-[#c2b2a6] focus:bg-white lg:py-2.5"
              />
            </div>

            <div className="grid gap-3 lg:min-h-0 lg:flex-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-2.5">
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

              {!ordersLoading && !ordersError && paginatedOrders.map((order) => (
                <button
                  key={order.id}
                  type="button"
                  onClick={() => handleSelectOrder(order)}
                  className={`group flex w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-all lg:min-h-0 lg:p-3.5 ${
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

            {!ordersLoading && !ordersError && totalPages > 1 && (
              <div className="-mx-6 -mb-6 mt-5 flex shrink-0 items-center justify-between border-t border-[#eee6de] bg-[#fcfaf7] px-6 py-4 lg:-mx-5 lg:-mb-5 lg:mt-3 lg:px-5 lg:py-3">
                <p className="text-xs font-medium text-[#8f8376]">
                  {firstVisibleOrder}-{lastVisibleOrder} of {filteredOrders.length}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(safePage - 1)}
                    disabled={safePage === 1}
                    aria-label="Previous page"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d7c9b8] bg-white text-[#5f564d] transition hover:border-[#c2b2a6] hover:bg-[#f4ece4] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ChevronLeft size={15} />
                  </button>

                  <span className="min-w-14 text-center text-xs font-semibold text-[#5f564d]">
                    {safePage} / {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setCurrentPage(safePage + 1)}
                    disabled={safePage === totalPages}
                    aria-label="Next page"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d7c9b8] bg-white text-[#5f564d] transition hover:border-[#c2b2a6] hover:bg-[#f4ece4] disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-[#2c2b28]/45 backdrop-blur-sm"
              onClick={() => setSelectedOrderId('')}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`Delivery tracking for ${selectedOrder.orderNumber}`}
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: 'spring', damping: 24, stiffness: 240 }}
              className="fixed inset-x-3 bottom-3 top-[4.75rem] z-[90] overflow-hidden rounded-2xl bg-[#eae0d6] p-3 shadow-2xl sm:inset-x-6 sm:bottom-6 sm:top-[5.5rem] sm:p-4 lg:bottom-6 lg:left-[17.5rem] lg:right-6 lg:top-[6.5rem]"
            >
              <div className="absolute right-6 top-6 z-20">
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
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderTracking;
