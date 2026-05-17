import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const createProduct = async (formData, token) => {
  const response = await axios.post(`${API_URL}/api/products`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};