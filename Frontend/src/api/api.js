// api.js
import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://ptudwnc-final-project.vercel.app',
  // headers: {
  //   'Content-Type': 'application/json',
  //   'Access-Control-Allow-Origin': 'https://ptudwnc-final-project-client-site.vercel.app', // Replace with your frontend
  // },
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000', // Replace with your frontend
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