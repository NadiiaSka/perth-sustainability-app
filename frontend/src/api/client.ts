import axios from "axios";
import type {
  Household,
  UsageEntry,
  DashboardData,
  CreateHouseholdRequest,
  UpdateHouseholdRequest,
  CreateUsageEntryRequest,
  UpdateUsageEntryRequest,
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const householdApi = {
  getAll: () => api.get<{ households: Household[] }>("/households"),
  getById: (id: number) => api.get<DashboardData>(`/households/${id}`),
  create: (data: CreateHouseholdRequest) =>
    api.post<Household>("/households", data),
  update: (id: number, data: UpdateHouseholdRequest) =>
    api.put<Household>(`/households/${id}`, data),
  delete: (id: number) => api.delete(`/households/${id}`),
};

export const usageApi = {
  create: (data: CreateUsageEntryRequest) =>
    api.post<UsageEntry>("/usage", data),
  getById: (id: number) => api.get<UsageEntry>(`/usage/${id}`),
  delete: (id: number) => api.delete(`/usage/${id}`),
  update: (id: number, data: UpdateUsageEntryRequest) =>
    api.put<UsageEntry>(`/usage/${id}`, data),
  exportCsv: (householdId: number) =>
    api.get(`/usage/export/${householdId}`, { responseType: "blob" }),
  importCsv: (householdId: number, csvData: string) =>
    api.post(`/usage/import/${householdId}`, { csv_data: csvData }),
};

export default api;
