export interface Household {
  id: number;
  name: string;
  members: number;
  postcode: string;
  created_at: string;
}
export interface UsageEntry {
  id: number;
  household_id: number;
  entry_type: "water" | "energy";
  value: number;
  recorded_at: string;
}
export interface DashboardData {
  household: Household;
  entries: UsageEntry[];
  summary: UsageSummary;
  greenScore: number;
  tips: string[];
}
export interface UsageSummary {
  water?: number;
  energy?: number;
}

export interface HouseholdFormData {
  name: string;
  members: number | "";
  postcode: string;
}
export interface UsageFormData {
  entry_type: "water" | "energy";
  value: number | "";
  recorded_at: string;
}

export interface CreateHouseholdRequest {
  name: string;
  members: number;
  postcode: string;
}

export interface UpdateHouseholdRequest {
  name?: string;
  members?: number;
  postcode?: string;
}

export interface CreateUsageEntryRequest {
  household_id: number;
  entry_type: "water" | "energy";
  value: number;
  recorded_at?: string;
}
export interface UpdateUsageEntryRequest {
  entry_type?: "water" | "energy";
  value?: number;
  recorded_at?: string;
}

export type EntryType = "water" | "energy";
export type SortColumn = "type" | "value" | "date";
export type SortOrder = "asc" | "desc";
