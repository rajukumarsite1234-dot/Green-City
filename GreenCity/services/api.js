import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// BASE_URL in production is https://api.myapp.com
export const BASE_URL = __DEV__ ? 'http:// 192.168.96.118' : 'https://api.myapp.com';

const api = axios.create({ baseURL: BASE_URL });

export async function setToken(token) {
  await SecureStore.setItemAsync('userToken', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export async function loadToken() {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return token;
}

export async function clearToken() {
  await SecureStore.deleteItemAsync('userToken');
  delete api.defaults.headers.common['Authorization'];
}

export default api;
