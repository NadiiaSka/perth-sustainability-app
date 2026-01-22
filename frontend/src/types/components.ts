import { ReactNode } from "react";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
}

export interface FormInputProps {
  label: string;
  type: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  min?: string;
  max?: string;
  step?: string;
  suffix?: ReactNode;
  icon?: ReactNode;
  helperText?: string;
}

export interface SummaryCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: ReactNode;
  bgColor: string;
  textColor: string;
}

export interface UsageChartProps {
  data: ChartDataPoint[];
  title: string;
  color: string;
  label: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}
