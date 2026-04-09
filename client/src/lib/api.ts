import axios from 'axios';

// Utiliser l'URL de l'API externe définie dans .env
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  login: async (creds: any) => {
    const res = await api.post('/auth/login', creds);
    if (res.data.token) localStorage.setItem('token', res.data.token);
    return res.data;
  },
  updatePassword: async (newPassword: string) => {
    const token = localStorage.getItem('token');
    console.log('Update Password API Call: Token found directly:', !!token);
    const res = await api.post('/auth/update-password', { new_password: newPassword }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  },
  logout: () => localStorage.removeItem('token')
};

export const productApi = {
  getProducts: async () => (await api.get('/products')).data,
  addProduct: async (data: any) => (await api.post('/admin/products', data)).data,
  updateProduct: async (id: string, data: any) => (await api.put(`/admin/products/${id}`, data)).data,
  deleteProduct: async (id: string) => (await api.delete(`/admin/products/${id}`)).data
};

export const orderApi = {
  getAdminOrders: async () => (await api.get('/admin/orders')).data,
  createOrder: async (orderData: any) => (await api.post('/orders', orderData)).data,
  updateOrderStatus: async (id: string, status: string) => (await api.patch(`/admin/orders/${id}/status`, { status })).data,
  getStats: async () => (await api.get('/admin/stats')).data
};

export default api;
