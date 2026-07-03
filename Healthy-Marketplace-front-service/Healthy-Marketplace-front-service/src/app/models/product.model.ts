// ─── Matches backend entities exactly ────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: Category;
}

// ─── Request payloads ─────────────────────────────────────────────────────────

export interface ProductRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: { id: number }; // backend uses @ManyToOne, just send { id }
}

export interface CategoryRequest {
  name: string;
  description?: string;
}
