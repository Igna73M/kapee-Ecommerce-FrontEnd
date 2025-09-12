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
  // Toast logic removed

  if (!product) return null;

  if (!isOpen) return null;
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6'>
        <button
          className='absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors'
          onClick={onClose}
          aria-label='Close'
        >
          <X className='h-6 w-6' />
        </button>
        <h2 className='text-2xl font-bold mb-4'>{product.name}</h2>
        <div className='grid md:grid-cols-2 gap-8'>
          {/* Product Image */}
          <div className='relative'>
            {product.discount && (
              <span className='absolute top-4 left-4 z-10 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded'>
                {product.discount}% Off
              </span>
            )}
            <div className='aspect-square overflow-hidden rounded-lg'>
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
              <div className='text-sm text-muted-foreground mb-2'>
                {product.category}
              </div>
              <h1 className='text-3xl font-bold mb-4'>{product.name}</h1>

              {product.rating && (
                <div className='flex items-center gap-2 mb-4'>
                  <div className='flex items-center gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating!)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className='text-sm text-muted-foreground'>
                    ({product.rating}) Rating
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className='flex items-center gap-3'>
              <span className='text-3xl font-bold text-primary'>
                ${product.price}.00
              </span>
              {product.originalPrice && (
                <span className='text-lg text-muted-foreground line-through'>
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
            <p className='text-muted-foreground'>{product.description}</p>

            {/* Features */}
            {product.features && (
              <div>
                <h3 className='font-semibold mb-3'>Key Features:</h3>
                <ul className='space-y-2'>
                  {product.features.map((feature, index) => (
                    <li key={index} className='flex items-center text-sm'>
                      <span className='w-2 h-2 bg-primary rounded-full mr-3'></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector */}
            <div className='flex items-center gap-4'>
              <span className='font-medium'>Quantity:</span>
              <div className='flex items-center border rounded-lg'>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className='h-10 w-10 flex items-center justify-center bg-transparent hover:bg-gray-100 rounded-l-lg transition-colors duration-150'
                  type='button'
                  aria-label='Decrease quantity'
                >
                  <Minus className='h-4 w-4' />
                </button>
                <span className='px-4 py-2 min-w-12 text-center'>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className='h-10 w-10 flex items-center justify-center bg-transparent hover:bg-gray-100 rounded-r-lg transition-colors duration-150'
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
                className='flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded font-semibold transition-colors duration-150 disabled:opacity-50 text-sm'
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
                    ? "bg-red-100 border-red-400 text-red-600"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
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
                      : ""
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
              <span className='text-sm'>
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
