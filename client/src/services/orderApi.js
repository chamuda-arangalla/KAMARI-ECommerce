import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const createOrder = async (payload, token) => {
  const response = await axios.post(`${API_URL}/api/orders`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getOrdersByUserId = async (userId, token) => {
  const response = await axios.get(`${API_URL}/api/orders/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getAllOrders = async (token) => {
  const response = await axios.get(`${API_URL}/api/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getOrderById = async (orderId, token) => {
  const response = await axios.get(`${API_URL}/api/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const uploadPaymentSlip = async (orderId, file, token) => {
  const formData = new FormData();
  formData.append("paymentSlip", file);

  const response = await axios.post(
    `${API_URL}/api/orders/${orderId}/payment-slip`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
