export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  created_at: string;
}

export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  errors?: Array<{ msg: string; field?: string }>;
}