import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
  return response.data;
};

export const registerCustomer = async (data) => {
  const response = await axios.post(`${API_URL}/api/auth/customer/register`, data);
  return response.data;
};

export const loginCustomer = async (email, password) => {
  const response = await axios.post(`${API_URL}/api/auth/customer/login`, { email, password });
  return response.data;
};
