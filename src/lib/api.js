import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Usa el puerto de tu backend
  timeout: 10000,
});

export default api;