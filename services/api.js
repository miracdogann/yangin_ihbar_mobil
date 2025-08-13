import axios from "axios";

export const API_BASE_URL ="https://123640c2b4ca.ngrok-free.app/api/"


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

export const getStations = () => apiClient.get("stations/") 
export const getFireReportAll =() => apiClient.get("fire-report-all/")

export const getFireReportUser = async (token) => {
  const res = await apiClient.get("fire-report-user/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


export const getAllReports = () => apiClient.get("fire-report-all/")
