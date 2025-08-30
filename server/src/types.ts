// src/types.ts
import type { Request } from "express";
import type { IUser } from "./models/User";

export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  leetcode?:string;
  instagram?:string;
  profilePic?: File | null;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  googleUsers: number;
  githubUsers: number;
  localUsers: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// User interface for frontend
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  instagram?: string;
  leetcode?: string;
  avatar?: string;
  authProvider: 'local' | 'google' | 'github';
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  website?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
  expiresIn?: number;
}

export interface OAuthProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'github';
}

// Dashboard types
export interface Product {
  id: string;
  name: string;
  category: string;
  percentage: number;
  sales: number;
  color?: string;
}

export interface StatsData {
  revenues: number;
  transactions: number;
  likes: number;
  users: number;
  revenueChange?: number;
  transactionChange?: number;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'revenue' | 'expense';
  category: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  target: string;
  timestamp: string;
  details?: Record<string, any>;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form types
export interface ProfileFormData {
  name: string;
  email: string;
  phone?: string;
  instagram?: string;
  leetcode?: string;
  avatar?: File | string;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Component props types
export interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onOAuthLogin?: (provider: 'google' | 'github') => void;
  onSwitchToRegister?: () => void;
}

export interface RegisterProps {
  onRegister: (data: RegisterData) => void;
  onSwitchToLogin: () => void;
}

export interface OAuthCallbackProps {
  onOAuthLogin: (token: string, userData: User) => void;
}