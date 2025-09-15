import { Product, Category } from '@/types/product';
import heroSmartphone from '@/assets/hero-smartphone.png';
import wirelessSpeaker from '@/assets/wireless-speaker.png';
import watchCharger from '@/assets/watch-charger.png';
import headphones from '@/assets/headphones.png';

export const categories: Category[] = [
  { id: '1', name: "Men's Clothing" },
  { id: '2', name: "Women's Clothing" },
  { id: '3', name: 'Accessories' },
  { id: '4', name: 'Shoes' },
  { id: '5', name: 'Jewellery' },
  { id: '6', name: 'Bags & Backpacks' },
  { id: '7', name: 'Watches' },
  { id: '8', name: 'Dresses' },
  { id: '9', name: 'Shirts' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Apple Watch Series 5',
    description: 'GPS + Cellular, Always-On Retina display, 30% larger screen, Swimproof, ECG app',
    price: 499,
    originalPrice: 599,
    discount: 17,
    image: watchCharger,
    category: 'Electronics',
    features: [
      'GPS + Cellular',
      'Always-On Retina display',
      '30% larger screen',
      'Swimproof',
      'ECG app'
    ],
    rating: 4.8,
    inStock: true
  },
  {
    id: '2',
    name: 'Wireless Bluetooth Speaker',
    description: 'Digital Smart Wireless Speaker with premium sound quality and long battery life',
    price: 129,
    originalPrice: 189,
    discount: 32,
    image: wirelessSpeaker,
    category: 'Electronics',
    features: [
      'Bluetooth 5.0',
      '360° Sound',
      'Waterproof IPX7',
      '12h Battery Life'
    ],
    rating: 4.6,
    inStock: true
  },
  {
    id: '3',
    name: 'Premium Wireless Headphones',
    description: 'Beats EP On-Ear Personalized Headphones with Active Noise Cancellation',
    price: 199,
    originalPrice: 299,
    discount: 33,
    image: headphones,
    category: 'Electronics',
    features: [
      'Active Noise Cancellation',
      'Wireless Bluetooth',
      '30h Battery Life',
      'Fast Charging'
    ],
    rating: 4.7,
    inStock: true
  },
  {
    id: '4',
    name: 'Smartphone Charging Stand',
    description: 'Best Smartphone Wireless Charging Stand with fast charging technology',
    price: 79,
    originalPrice: 129,
    discount: 39,
    image: heroSmartphone,
    category: 'Electronics',
    features: [
      'Fast Wireless Charging',
      'Compatible with All Devices',
      'LED Indicator',
      'Anti-Slip Design'
    ],
    rating: 4.5,
    inStock: true
  },
  {
    id: '5',
    name: 'Smart Watch Charger',
    description: 'Digital Smart Watch Charger with magnetic charging dock',
    price: 59,
    originalPrice: 89,
    discount: 34,
    image: watchCharger,
    category: 'Electronics',
    features: [
      'Magnetic Charging',
      'Fast Charging',
      'Compact Design',
      'Universal Compatibility'
    ],
    rating: 4.4,
    inStock: true
  },
  {
    id: '6',
    name: 'Bluetooth Earbuds Pro',
    description: 'True wireless earbuds with premium sound and noise cancellation',
    price: 149,
    originalPrice: 199,
    discount: 25,
    image: headphones,
    category: 'Electronics',
    features: [
      'True Wireless',
      'Noise Cancellation',
      '8h + 24h Battery',
      'Touch Controls'
    ],
    rating: 4.6,
    inStock: true
  }
];