import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getHomeContent = async () => {
  const response = await axios.get(`${API_URL}/api/home-content`);
  return response.data;
};

export const updateHomeContent = async (formData, token) => {
  const response = await axios.put(`${API_URL}/api/home-content`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
