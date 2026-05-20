import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getSiteContent = async (pageType) => {
  const res = await axios.get(`${API_URL}/api/site-content/${pageType}`);
  return res.data;
};

export const updateSiteContent = async (pageType, data, token) => {
  const res = await axios.put(`${API_URL}/api/site-content/${pageType}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const uploadContentImage = async (file, token) => {
  const fd = new FormData();
  fd.append("image", file);
  const res = await axios.post(`${API_URL}/api/site-content/upload-image`, fd, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
