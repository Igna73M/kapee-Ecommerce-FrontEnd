export interface Product {
  _id: string;
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
  quantity?: number;
}

export interface Category {
  _id: string;
  name: string;
  icon?: string;
}