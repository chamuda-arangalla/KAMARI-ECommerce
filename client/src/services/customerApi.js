import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const mapBackendCustomerToAdminCustomer = (customer) => {
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim();
  const defaultAddress = customer.addresses?.find((address) => address.isDefault) || customer.addresses?.[0];

  return {
    id: customer.id || customer._id,
    firstName: customer.firstName || "",
    lastName: customer.lastName || "",
    name: name || customer.email || "Customer",
    email: customer.email || "",
    phone: customer.phone || "No phone",
    addresses: customer.addresses || [],
    defaultAddress,
    isActive: customer.isActive,
    joinedDate: customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "N/A",
    totalOrders: 0,
    lastOrderDate: "No orders",
    orderHistory: [],
    raw: customer,
  };
};

export const getCustomers = async (token) => {
  const response = await axios.get(`${API_URL}/api/customers`, getAuthConfig(token));
  return response.data;
};

export const createCustomer = async (payload, token) => {
  const response = await axios.post(`${API_URL}/api/customers`, payload, getAuthConfig(token));
  return response.data;
};

export const getCustomerById = async (id, token) => {
  const response = await axios.get(`${API_URL}/api/customers/${id}`, getAuthConfig(token));
  return response.data;
};

export const updateCustomer = async (id, payload, token) => {
  const response = await axios.put(`${API_URL}/api/customers/${id}`, payload, getAuthConfig(token));
  return response.data;
};

export const deleteCustomer = async (id, token) => {
  const response = await axios.delete(`${API_URL}/api/customers/${id}`, getAuthConfig(token));
  return response.data;
};

export const getMyProfile = async (token) => {
  const response = await axios.get(`${API_URL}/api/customers/me`, getAuthConfig(token));
  return response.data;
};

export const updateMyProfile = async (payload, token) => {
  const response = await axios.put(`${API_URL}/api/customers/me`, payload, getAuthConfig(token));
  return response.data;
};
