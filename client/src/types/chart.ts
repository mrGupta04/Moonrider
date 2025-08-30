// src/types/chart.ts
import { 
  ChartData, 
  ChartOptions, 
  ChartTypeRegistry, 
  TooltipItem 
} from 'chart';

// Common chart props interface
export interface ChartProps {
  data: ChartData<'bar' | 'line' | 'doughnut'>;
  options?: ChartOptions<'bar' | 'line' | 'doughnut'>;
  height?: number;
  width?: number;
}

// Revenue vs Expenses Chart specific types
export interface RevenueExpenseData {
  months: string[];
  revenue: number[];
  expenses: number[];
}

export interface RevenueExpenseChartProps {
  data?: RevenueExpenseData;
  height?: number;
  width?: number;
}

// Monthly Trend Chart specific types
export interface MonthlyTrendData {
  months: string[];
  profit: number[];
}

export interface MonthlyTrendChartProps {
  data?: MonthlyTrendData;
  height?: number;
  width?: number;
}

// Expense Distribution Chart specific types
export interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
}

export interface ExpenseDistributionData {
  categories: ExpenseCategory[];
}

export interface ExpenseDistributionChartProps {
  data?: ExpenseDistributionData;
  height?: number;
  width?: number;
}

// Tooltip callback types
export type TooltipCallback = (tooltipItem: TooltipItem<keyof ChartTypeRegistry>) => string;