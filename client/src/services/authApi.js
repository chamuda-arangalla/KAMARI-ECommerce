import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ;

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
  return response.data;
};

export const loginAdmin = async (username, password) => {
  const response = await axios.post(`${API_URL}/api/auth/admin/login`, { username, password });
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

export const logout = async () => {
  const response = await axios.post(`${API_URL}/api/auth/logout`);
  return response.data;
};

export const logoutAdmin = async () => {
  const response = await axios.post(`${API_URL}/api/auth/admin/logout`);
  return response.data;
};

export const logoutCustomer = async () => {
  const response = await axios.post(`${API_URL}/api/auth/customer/logout`);
  return response.data;
};
