import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

const toFormData = (payload, imageFile) => {
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, v);
  });
  if (imageFile) fd.append("image", imageFile);
  return fd;
};

export const getCollections = async () => {
  const res = await axios.get(`${API_URL}/api/collections`);
  return res.data;
};

export const getCollectionsAdmin = async (token) => {
  const res = await axios.get(`${API_URL}/api/collections/admin/all`, authHeader(token));
  return res.data;
};

export const createCollection = async (payload, imageFile, token) => {
  const fd = toFormData(payload, imageFile);
  const res = await axios.post(`${API_URL}/api/collections`, fd, authHeader(token));
  return res.data;
};

export const updateCollection = async (id, payload, imageFile, token) => {
  const fd = toFormData(payload, imageFile);
  const res = await axios.put(`${API_URL}/api/collections/${id}`, fd, authHeader(token));
  return res.data;
};

export const deleteCollection = async (id, token) => {
  const res = await axios.delete(`${API_URL}/api/collections/${id}`, authHeader(token));
  return res.data;
};
