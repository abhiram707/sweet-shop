export interface User {
  id: string;
  email: string;
  password: string;
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

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  role?: 'admin' | 'customer';
}

export interface CreateSweetRequest {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  image_url?: string;
}

export interface UpdateSweetRequest extends Partial<CreateSweetRequest> {}

export interface PurchaseRequest {
  quantity: number;
}

export interface RestockRequest {
  quantity: number;
}

export interface SearchQuery {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}