import { createContext, useContext, useEffect, useState } from 'react';
import { mockOrders } from '../data/adminMockData';
import {
  createCustomer as createCustomerRequest,
  deleteCustomer as deleteCustomerRequest,
  getCustomers,
  mapBackendCustomerToAdminCustomer,
  updateCustomer as updateCustomerRequest,
} from '../services/customerApi';
import { getProducts, mapBackendProductToAdminProduct } from '../services/productApi';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState("");
  const [orders, setOrders] = useState(mockOrders);
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
    refreshProducts();
    refreshCustomers();
  }, []);

  const updateOrderStatus = (orderId, newStatus, description) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
        return {
          ...order,
          status: newStatus,
          trackingTimeline: [
            ...order.trackingTimeline,
            { status: newStatus, date: now, description }
          ]
        };
      }
      return order;
    }));
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
      customers,
      customersLoading,
      customersError,
      refreshProducts,
      refreshCustomers,
      updateOrderStatus,
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

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
