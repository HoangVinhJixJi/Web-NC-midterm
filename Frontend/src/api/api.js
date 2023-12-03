// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://webnc-ga01.vercel.app',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://frontend-test-vert.vercel.app', // Replace with your frontend 
  },
});

// Hàm này sẽ thêm token vào header nếu có
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api;