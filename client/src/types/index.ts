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
export * from './chart';
export interface UserProfile extends User {
  bio?: string;
  location?: string;
  website?: string;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profilePic?: File | null;
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
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

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
  onProfileUpdate: (updatedUser: User) => void;
}

export interface LoginProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onOAuthLogin?: (provider: 'google' | 'github') => void;
  onSwitchToRegister?: () => void;
  isLoading?: boolean;
}

export interface RegisterProps {
  onRegister: (formData: FormData) => Promise<boolean>;
  onSwitchToLogin: () => void;
  isLoading: boolean;
}

export interface OAuthCallbackProps {
  onOAuthLogin: (token: string, userData: User) => void;
}

// Additional types for enhanced functionality
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  googleUsers: number;
  githubUsers: number;
  localUsers: number;
}

export interface UserStats {
  total: number;
  active: number;
  newThisMonth: number;
  byProvider: {
    google: number;
    github: number;
    local: number;
  };
}

// Social media types
export interface SocialMediaProfile {
  platform: 'instagram' | 'leetcode' | 'youtube' | 'website';
  username?: string;
  url: string;
  followers?: number;
  posts?: number;
}

// File upload types
export interface UploadResponse {
  success: boolean;
  message: string;
  filePath?: string;
  url?: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// Settings types
export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
    activityVisible: boolean;
  };
}