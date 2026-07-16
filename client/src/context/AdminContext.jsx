import { useEffect, useState } from 'react';
import {
  createCustomer as createCustomerRequest,
  deleteCustomer as deleteCustomerRequest,
  getCustomers,
  mapBackendCustomerToAdminCustomer,
  updateCustomer as updateCustomerRequest,
} from '../services/customerApi';
import { getAllOrders, updateOrder as updateOrderRequest } from '../services/orderApi';
import { getProducts, mapBackendProductToAdminProduct } from '../services/productApi';
import { AdminContext } from './adminContextValue';

const formatOrderDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-LK", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

const formatTimelineDate = (value) =>
  value
    ? new Date(value).toLocaleString("en-LK", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

const normalizeOrderStatus = (paymentStatus) => {
  if (!paymentStatus) return "Pending";
  if (String(paymentStatus).toUpperCase() === "COD") return "COD";
  return String(paymentStatus).charAt(0).toUpperCase() + String(paymentStatus).slice(1).toLowerCase();
};

const normalizeFulfillmentStatus = (orderStatus) => {
  if (!orderStatus) return "Created";
  return String(orderStatus).charAt(0).toUpperCase() + String(orderStatus).slice(1).toLowerCase();
};

const PAYMENT_METHOD_LABELS = {
  bank_transfer: "Bank Transfer",
  cash_on_delivery: "Cash on Delivery",
  onepay: "OnePay",
};

const getPaymentType = (order) => {
  if (String(order.paymentStatus).toUpperCase() === "COD") return "Cash on Delivery";
  return PAYMENT_METHOD_LABELS[order.paymentMethod] || "Bank Transfer";
};

const needsPaymentVerification = (order) =>
  order.paymentStatus === "pending" &&
  String(order.paymentStatus).toUpperCase() !== "COD" &&
  Boolean(order.paymentSlip?.url);

const mapBackendOrderToAdminOrder = (order) => {
  const receiver = order.receiverDetails || {};
  const location = receiver.location || {};
  const items = order.productDetails || [];

  return {
    id: order._id,
    orderNumber: order.orderId || order._id,
    customerName: [receiver.firstName, receiver.lastName].filter(Boolean).join(" ") || "Customer",
    items: items.map((item) => ({
      name: item.productName,
      quantity: Number(item.quantity || 0),
      price: Number(item.unitPrice || 0),
      colour: item.colour,
      size: item.size,
    })),
    totalAmount: Number(order.pricing?.grandTotal || 0),
    deliveryAddress: [
      location.address,
      location.district,
      location.province,
      location.postalCode,
      location.country,
    ].filter(Boolean).join(", "),
    status: normalizeOrderStatus(order.paymentStatus),
    orderStatus: normalizeFulfillmentStatus(order.orderStatus),
    paymentType: getPaymentType(order),
    needsPaymentVerification: needsPaymentVerification(order),
    date: formatOrderDate(order.createdAt),
    paymentSlip: order.paymentSlip || null,
    trackingTimeline: [
      {
        status: normalizeFulfillmentStatus(order.orderStatus),
        date: formatTimelineDate(order.createdAt),
        description: "Order created",
      },
    ],
    raw: order,
  };
};

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersError, setCustomersError] = useState("");

  const refreshProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError("");

      const response = await getProducts();
      const backendProducts = response.data || [];

      setProducts(backendProducts.map(mapBackendProductToAdminProduct));
    } catch (error) {
      setProductsError(
        error.response?.data?.message || "Failed to load products",
      );
    } finally {
      setProductsLoading(false);
    }
  };

  const refreshOrders = async () => {
    try {
      setOrdersLoading(true);
      setOrdersError("");

      const token = localStorage.getItem("adminToken");
      const response = await getAllOrders(token);

      setOrders((response.data || []).map(mapBackendOrderToAdminOrder));
    } catch (error) {
      setOrdersError(
        error.response?.data?.message || "Failed to load orders",
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  const refreshCustomers = async () => {
    try {
      setCustomersLoading(true);
      setCustomersError("");

      const token = localStorage.getItem("adminToken");
      const response = await getCustomers(token);

      setCustomers((response.data || []).map(mapBackendCustomerToAdminCustomer));
    } catch (error) {
      setCustomersError(
        error.response?.data?.message || "Failed to load customers",
      );
    } finally {
      setCustomersLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refreshProducts();
      refreshOrders();
      refreshCustomers();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const updateOrderStatus = async (orderId, newStatus, description) => {
    const token = localStorage.getItem("adminToken");
    const response = await updateOrderRequest(orderId, { orderStatus: newStatus.toLowerCase() }, token);
    const updatedOrder = mapBackendOrderToAdminOrder(response.data);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...updatedOrder,
        trackingTimeline: [
          ...order.trackingTimeline,
          { status: updatedOrder.orderStatus, date: now, description }
        ]
      };
    }));

    return updatedOrder;
  };

  const verifyOrderPayment = async (orderId) => {
    const token = localStorage.getItem("adminToken");
    const response = await updateOrderRequest(orderId, { paymentStatus: "complete" }, token);
    const updatedOrder = mapBackendOrderToAdminOrder(response.data);

    setOrders(prev => prev.map(order => order.id === orderId ? updatedOrder : order));
    return updatedOrder;
  };

  const updateStockCount = (productId, size, count) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          stock: {
            ...product.stock,
            [size]: parseInt(count)
          }
        };
      }
      return product;
    }));
  };

  const addProduct = (newProduct) => {
    setProducts(prev => [...prev, { ...newProduct, id: `p${prev.length + 1}` }]);
  };

  const editProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const editCustomer = async (customerId, payload) => {
    const token = localStorage.getItem("adminToken");
    const response = await updateCustomerRequest(customerId, payload, token);
    const updatedCustomer = mapBackendCustomerToAdminCustomer(response.data);

    setCustomers(prev => prev.map(customer => customer.id === customerId ? updatedCustomer : customer));
    return updatedCustomer;
  };

  const addCustomer = async (payload) => {
    const token = localStorage.getItem("adminToken");
    const response = await createCustomerRequest(payload, token);
    const createdCustomer = mapBackendCustomerToAdminCustomer(response.data);

    setCustomers(prev => [createdCustomer, ...prev]);
    return createdCustomer;
  };

  const deleteCustomer = async (customerId) => {
    const token = localStorage.getItem("adminToken");
    await deleteCustomerRequest(customerId, token);
    setCustomers(prev => prev.filter(customer => customer.id !== customerId));
  };

  return (
    <AdminContext.Provider value={{
      products,
      productsLoading,
      productsError,
      orders,
      ordersLoading,
      ordersError,
      customers,
      customersLoading,
      customersError,
      refreshProducts,
      refreshOrders,
      refreshCustomers,
      updateOrderStatus,
      verifyOrderPayment,
      updateStockCount,
      addProduct,
      editProduct,
      deleteProduct,
      addCustomer,
      editCustomer,
      deleteCustomer
    }}>
      {children}
    </AdminContext.Provider>
  );
};
