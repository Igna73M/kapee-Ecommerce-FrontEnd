export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  features?: string[];
  rating?: number;
  inStock?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}