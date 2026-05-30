import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Download, Loader2, Search } from 'lucide-react';
import { useAdmin } from '../../context/useAdmin';

const formatCurrency = (value) => `LKR ${Number(value || 0).toLocaleString()}`;

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Complete: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    COD: 'bg-sky-100 text-sky-700 border-sky-200',
  };
  return (
    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

const OrderStatusBadge = ({ status }) => {
  const styles = {
    Created: 'bg-stone-100 text-stone-700 border-stone-200',
    Shipping: 'bg-blue-100 text-blue-700 border-blue-200',
    Received: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  return (
    <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

const NeedVerifyBadge = ({ needsVerify }) => (
  <span
    className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${
      needsVerify
        ? 'bg-amber-100 text-amber-700 border-amber-200'
        : 'bg-gray-100 text-gray-700 border-gray-200'
    }`}
  >
    {needsVerify ? 'Yes' : 'No'}
  </span>
);

const getNextOrderStatusOptions = (status) => {
  if (status === 'Created') return ['Shipping', 'Received'];
  if (status === 'Shipping') return ['Received'];
  return [];
};

const OrdersPage = () => {
  const { orders, ordersLoading, ordersError, refreshOrders, updateOrderStatus, verifyOrderPayment } = useAdmin();
  const [filter, setFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [updatingOrderStatus, setUpdatingOrderStatus] = useState(false);
  const [orderStatusError, setOrderStatusError] = useState('');

  const tabs = [
    { label: 'All', type: 'all' },
    { label: 'Created', type: 'orderStatus', value: 'Created' },
    { label: 'Shipping', type: 'orderStatus', value: 'Shipping' },
    { label: 'Received', type: 'orderStatus', value: 'Received' },
    { label: 'Pending Payment', type: 'status', value: 'Pending' },
    { label: 'COD Payment', type: 'status', value: 'COD' },
    { label: 'Complete Payment', type: 'status', value: 'Complete' },
  ];
  const activeTab = tabs.find((tab) => tab.label === filter) || tabs[0];
  const tabFilteredOrders = activeTab.type === 'all'
    ? orders
    : orders.filter((order) => order[activeTab.type] === activeTab.value);
  const filteredOrders = tabFilteredOrders.filter((order) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;

    return [
      order.orderNumber,
      order.customerName,
      order.deliveryAddress,
      order.status,
      order.orderStatus,
      order.paymentType,
    ].some((value) => String(value || '').toLowerCase().includes(query));
  });
  const isSelectedOrderCod = selectedOrder?.paymentType === 'Cash on Delivery';
  const canVerifyPayment =
    selectedOrder?.status === 'Pending' &&
    selectedOrder?.paymentSlip?.url &&
    !isSelectedOrderCod;
  const nextOrderStatusOptions = getNextOrderStatusOptions(selectedOrder?.orderStatus);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setVerifyError('');
    setOrderStatusError('');
  };

  const handleCloseOrder = () => {
    setSelectedOrder(null);
    setVerifyError('');
    setOrderStatusError('');
  };

  const handleVerifyPayment = async () => {
    if (!selectedOrder || !canVerifyPayment) return;

    try {
      setVerifyingPayment(true);
      setVerifyError('');
      const updatedOrder = await verifyOrderPayment(selectedOrder.id);
      setSelectedOrder(updatedOrder);
    } catch (error) {
      setVerifyError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to verify payment',
      );
    } finally {
      setVerifyingPayment(false);
    }
  };

  const handleOrderStatusChange = async (event) => {
    const nextStatus = event.target.value;
    if (!selectedOrder || !nextStatus || nextStatus === selectedOrder.orderStatus) return;

    try {
      setUpdatingOrderStatus(true);
      setOrderStatusError('');
      const updatedOrder = await updateOrderStatus(
        selectedOrder.id,
        nextStatus,
        `Order status updated to ${nextStatus}`,
      );
      setSelectedOrder(updatedOrder);
    } catch (error) {
      setOrderStatusError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          'Failed to update order status',
      );
    } finally {
      setUpdatingOrderStatus(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#3b302a]">Orders</h2>
          <p className="text-[#a3948b] mt-1">Manage and track customer orders</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
          <button
            onClick={refreshOrders}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#e5ddd5] rounded-lg text-[#6b5e55] hover:bg-[#fcfaf7] transition-all"
          >
            <Download size={18} />
            <span>Refresh</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[#e5ddd5] rounded-xl text-base font-medium text-[#6b5e55] hover:bg-[#fcfaf7] transition-all">
            <Download size={20} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto border-b border-[#e5ddd5] sm:gap-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`relative shrink-0 px-1 pb-4 text-sm sm:text-base font-medium transition-all ${
              filter === tab ? 'text-[#3b302a]' : 'text-[#a3948b] hover:text-[#6b5e55]'
            }`}
          >
            {tab.label}
            {filter === tab.label && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3b302a]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[#e5ddd5] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#a3948b]">Search Orders</p>
            <p className="mt-1 text-sm text-[#7d746c]">{filteredOrders.length} shown</p>
          </div>
          <div className="relative w-full md:max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3948b]" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search order, customer, address, or status"
              className="w-full rounded-xl border border-[#e5ddd5] bg-[#fcfaf7] py-3 pl-10 pr-4 text-sm text-[#3b302a] outline-none transition-all placeholder:text-[#b8ada5] focus:border-[#c2b2a6] focus:bg-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e5ddd5] overflow-hidden shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#fcfaf7] border-b border-[#e5ddd5]">
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Order</th>
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Customer</th>
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Items</th>
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Total</th>
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Payment Status</th>
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Order Status</th>
                <th className="px-6 py-5 text-sm font-semibold text-[#a3948b] uppercase tracking-wider">Need to Verify</th>
                <th className="px-6 py-5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3ede8]">
              {ordersLoading && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[#6b5e55]">
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={18} className="animate-spin" />
                      Loading orders...
                    </span>
                  </td>
                </tr>
              )}

              {!ordersLoading && ordersError && (
                <tr>
                  <td colSpan={8} className="px-6 py-8">
                    <p className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                      {ordersError}
                    </p>
                  </td>
                </tr>
              )}

              {!ordersLoading && !ordersError && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-[#a3948b]">
                    No orders found.
                  </td>
                </tr>
              )}

              {!ordersLoading && !ordersError && filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-[#fcfaf7] transition-colors cursor-pointer group"
                  onClick={() => handleSelectOrder(order)}
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
                  <td className="px-6 py-4">
                    <OrderStatusBadge status={order.orderStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <NeedVerifyBadge needsVerify={order.needsPaymentVerification} />
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

        <div className="divide-y divide-[#f3ede8] md:hidden">
          {ordersLoading && (
            <div className="px-5 py-10 text-center text-[#6b5e55]">
              <span className="inline-flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Loading orders...
              </span>
            </div>
          )}

          {!ordersLoading && ordersError && (
            <div className="p-4">
              <p className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                {ordersError}
              </p>
            </div>
          )}

          {!ordersLoading && !ordersError && filteredOrders.length === 0 && (
            <div className="px-5 py-10 text-center text-[#a3948b]">No orders found.</div>
          )}

          {!ordersLoading && !ordersError && filteredOrders.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => setSelectedOrder(order)}
              className="block w-full p-4 text-left transition hover:bg-[#fcfaf7]"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-[#3b302a]">{order.orderNumber}</p>
                  <p className="mt-0.5 text-sm text-[#a3948b]">{order.date}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#a3948b]">Customer</p>
                  <p className="mt-1 font-medium text-[#6b5e55]">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#a3948b]">Total</p>
                  <p className="mt-1 font-semibold text-[#3b302a]">{formatCurrency(order.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#a3948b]">Items</p>
                  <p className="mt-1 text-[#6b5e55]">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <div className="flex items-end justify-end text-[#a3948b]">
                  <ChevronRight size={22} />
                </div>
              </div>
            </button>
          ))}
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
              onClick={handleCloseOrder}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl overflow-y-auto"
            >
              <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-[#3b302a]">Order Details</h3>
                  <button
                    onClick={handleCloseOrder}
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

                <div className="bg-white p-6 rounded-2xl border border-[#e5ddd5] space-y-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-[#a3948b] uppercase tracking-widest font-bold mb-1">Update Order Status</p>
                      <p className="text-sm text-[#7d746c]">Change the fulfillment stage for this order.</p>
                    </div>
                    <OrderStatusBadge status={selectedOrder.orderStatus} />
                  </div>
                  {nextOrderStatusOptions.length > 0 ? (
                    <select
                      value=""
                      onChange={handleOrderStatusChange}
                      disabled={updatingOrderStatus}
                      className="w-full rounded-xl border border-[#e5ddd5] bg-white px-4 py-3 text-sm font-medium text-[#3b302a] outline-none transition-all focus:border-[#c2b2a6] disabled:opacity-60"
                    >
                      <option value="">Select next status</option>
                      {nextOrderStatusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                      This order has been received. No further status updates are available.
                    </p>
                  )}
                  {orderStatusError && (
                    <p className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                      {orderStatusError}
                    </p>
                  )}
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

                {/* Payment */}
                <div>
                  <h4 className="text-base font-bold text-[#3b302a] uppercase tracking-widest mb-3">
                    {isSelectedOrderCod ? 'Payment' : 'Payment Slip'}
                  </h4>
                  {isSelectedOrderCod ? (
                    <p className="text-sm text-sky-700 py-3 px-4 bg-sky-50 rounded-lg border border-sky-100">
                      This is Cash on Delivery order.
                    </p>
                  ) : selectedOrder.paymentSlip?.url ? (
                    <div className="space-y-3">
                      <a
                        href={selectedOrder.paymentSlip.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block overflow-hidden rounded-xl border border-[#e5ddd5]"
                      >
                        <img
                          src={selectedOrder.paymentSlip.url}
                          alt="Payment slip"
                          className="w-full object-contain max-h-72 bg-[#f8f5f2]"
                        />
                      </a>
                      <a
                        href={selectedOrder.paymentSlip.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-[#7d746c] underline underline-offset-2 hover:text-[#3b302a] transition-colors"
                      >
                        View full image ↗
                      </a>
                      {canVerifyPayment && (
                        <button
                          type="button"
                          onClick={handleVerifyPayment}
                          disabled={verifyingPayment}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-700 disabled:opacity-60"
                        >
                          {verifyingPayment ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={16} />
                              Verify payment
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-[#a3948b] py-3 px-4 bg-[#f8f5f2] rounded-lg border border-[#e5ddd5]">
                      No payment slip uploaded yet.
                    </p>
                  )}
                  {verifyError && (
                    <p className="mt-3 rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                      {verifyError}
                    </p>
                  )}
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
