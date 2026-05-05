import React, { createContext, useContext, useState } from 'react';
import { mockProducts, mockOrders, mockCustomers } from '../data/adminMockData';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [customers, setCustomers] = useState(mockCustomers);

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

  return (
    <AdminContext.Provider value={{
      products,
      orders,
      customers,
      updateOrderStatus,
      updateStockCount,
      addProduct,
      editProduct,
      deleteProduct
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
