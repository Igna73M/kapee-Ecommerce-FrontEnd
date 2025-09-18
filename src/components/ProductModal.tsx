import { X, Heart, Minus, Plus, Star } from "lucide-react";
import { Product } from "@/types/product";
import { useState } from "react";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  addToCart?: (product: Product, quantity?: number) => void;
  openCart?: () => void;
  wishlist?: string[];
  toggleWishlist?: (productId: string) => void;
}

const ProductModal = ({
  product,
  isOpen,
  onClose,
  addToCart,
  openCart,
  wishlist = [],
  toggleWishlist,
}: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-gray-900/80'>
      <div className='bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6'>
        <button
          className='absolute top-4 right-4 text-gray-400 dark:text-yellow-100 hover:text-gray-700 dark:hover:text-yellow-400 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
          onClick={onClose}
          aria-label='Close'
        >
          <X className='h-6 w-6' />
        </button>
        <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-yellow-100'>
          {product.name}
        </h2>
        <div className='grid md:grid-cols-2 gap-8'>
          {/* Product Image */}
          <div className='relative'>
            {product.discount && (
              <span className='absolute top-4 left-4 z-10 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded'>
                {product.discount}% Off
              </span>
            )}
            <div className='aspect-square overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-700'>
              <img
                src={product.image}
                alt={product.name}
                className='w-full h-full object-cover'
              />
            </div>
          </div>

          {/* Product Details */}
          <div className='space-y-6'>
            <div>
              <div className='text-sm text-muted-foreground dark:text-yellow-100 mb-2'>
                {product.category}
              </div>
              <h1 className='text-3xl font-bold mb-4 text-gray-900 dark:text-yellow-100'>
                {product.name}
              </h1>

              {product.rating && (
                <div className='flex items-center gap-2 mb-4'>
                  <div className='flex items-center gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating!)
                            ? "fill-primary text-primary dark:fill-yellow-400 dark:text-yellow-400"
                            : "text-muted-foreground dark:text-yellow-100"
                        }`}
                      />
                    ))}
                  </div>
                  <span className='text-sm text-muted-foreground dark:text-yellow-100'>
                    ({product.rating}) Rating
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className='flex items-center gap-3'>
              <span className='text-3xl font-bold text-primary dark:text-yellow-400'>
                ${product.price}.00
              </span>
              {product.originalPrice && (
                <span className='text-lg text-muted-foreground dark:text-yellow-100 line-through'>
                  ${product.originalPrice}.00
                </span>
              )}
              {product.discount && (
                <span className='bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded'>
                  Save {product.discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className='text-muted-foreground dark:text-yellow-100'>
              {product.description}
            </p>

            {/* Features */}
            {product.features && (
              <div>
                <h3 className='font-semibold mb-3 text-gray-900 dark:text-yellow-100'>
                  Key Features:
                </h3>
                <ul className='space-y-2'>
                  {product.features.map((feature, index) => (
                    <li
                      key={index}
                      className='flex items-center text-sm text-gray-900 dark:text-yellow-100'
                    >
                      <span className='w-2 h-2 bg-primary dark:bg-yellow-400 rounded-full mr-3'></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector */}
            <div className='flex items-center gap-4'>
              <span className='font-medium text-gray-900 dark:text-yellow-100'>
                Quantity:
              </span>
              <div className='flex items-center border dark:border-gray-700 rounded-lg'>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className='h-10 w-10 flex items-center justify-center bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-lg transition-colors duration-150'
                  type='button'
                  aria-label='Decrease quantity'
                >
                  <Minus className='h-4 w-4' />
                </button>
                <span className='px-4 py-2 min-w-12 text-center text-gray-900 dark:text-yellow-100'>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className='h-10 w-10 flex items-center justify-center bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-lg transition-colors duration-150'
                  type='button'
                  aria-label='Increase quantity'
                >
                  <Plus className='h-4 w-4' />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4'>
              <button
                className='flex-1 bg-primary dark:bg-yellow-500 text-primary-foreground dark:text-gray-900 hover:bg-primary/90 dark:hover:bg-yellow-400 py-2 px-4 rounded font-semibold transition-colors duration-150 disabled:opacity-50 text-sm'
                onClick={() => {
                  if (addToCart && product) {
                    addToCart(product, quantity);
                    onClose();
                    if (openCart) openCart();
                  }
                }}
                disabled={!addToCart}
                type='button'
              >
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </button>
              <button
                className={`flex items-center justify-center border rounded px-4 py-2 font-semibold text-sm transition-colors duration-150 ${
                  wishlist.includes(product.id)
                    ? "bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-600 text-red-600 dark:text-red-400"
                    : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-yellow-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={() => {
                  if (toggleWishlist && product) {
                    toggleWishlist(product.id);
                  }
                }}
                type='button'
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${
                    wishlist.includes(product.id)
                      ? "text-red-500 fill-red-500"
                      : "dark:text-yellow-100"
                  }`}
                />
                {wishlist.includes(product.id) ? "Wishlisted" : "Wishlist"}
              </button>
            </div>

            {/* Stock Status */}
            <div className='flex items-center gap-2'>
              <div
                className={`w-3 h-3 rounded-full ${
                  product.inStock ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className='text-sm text-gray-900 dark:text-yellow-100'>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
