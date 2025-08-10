import axios from "axios";

export const API_BASE_URL ="https://a9b1d67df1b8.ngrok-free.app/api/"


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

export const getStations = () => apiClient.get("stations/") 