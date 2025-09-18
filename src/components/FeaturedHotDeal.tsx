import { Heart, Star } from "lucide-react";
import { Product } from "../types/product";

interface FeaturedHotDealProps {
  product: Product;
  onProductClick: (product: Product) => void;
  addToCart?: (product: Product, quantity?: number) => void;
}

const FeaturedHotDeal = ({
  product,
  onProductClick,
  addToCart,
}: FeaturedHotDealProps) => {
  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className='bg-card dark:bg-gray-800 rounded-lg border dark:border-yellow-600 hover:shadow-md transition-all duration-300 group relative overflow-hidden'>
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <span className='absolute top-2 left-2 z-10 bg-green-500 text-white border-transparent hover:bg-green-500/80 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'>
          {discountPercentage}% Off
        </span>
      )}

      {/* Featured Badge */}
      {product.discount && product.discount > 30 && (
        <span className='absolute top-2 right-2 z-10 bg-blue-500 text-white border-transparent hover:bg-green-500/80 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'>
          Featured
        </span>
      )}

      {/* Wishlist Button */}
      <button
        className='absolute top-2 right-2 z-10 bg-white/80 dark:bg-gray-900/80 hover:bg-red-100 dark:hover:bg-yellow-600 rounded-full p-2 transition-colors duration-150 shadow opacity-0 group-hover:opacity-100'
        onClick={(e) => {
          e.stopPropagation();
          if (addToCart) {
            addToCart(product);
          }
        }}
        aria-label='Add to wishlist'
      >
        <Heart className='h-4 w-4 text-gray-400 dark:text-yellow-100' />
      </button>

      {/* Product Image */}
      <div
        className='aspect-square overflow-hidden bg-muted dark:bg-gray-700 cursor-pointer'
        onClick={() => onProductClick(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
        />
      </div>

      {/* Product Info */}
      <div className='p-3 space-y-2'>
        {/* Category */}
        <div className='text-xs text-primary dark:text-yellow-400 font-medium uppercase tracking-wide'>
          {product.category}
        </div>

        {/* Product Name */}
        <h3
          className='font-semibold text-base leading-tight cursor-pointer hover:text-primary dark:hover:text-yellow-400 transition-colors line-clamp-2 text-gray-900 dark:text-yellow-100'
          onClick={() => onProductClick(product)}
        >
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className='flex items-center gap-1'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating!)
                    ? "fill-primary text-primary dark:fill-yellow-400 dark:text-yellow-400"
                    : "text-muted-foreground dark:text-yellow-100"
                }`}
              />
            ))}
            <span className='text-xs text-muted-foreground dark:text-yellow-100 ml-1'>
              ({product.rating})
            </span>
          </div>
        )}

        {/* Price */}
        <div className='flex items-center gap-2'>
          <span className='text-lg font-bold text-foreground dark:text-yellow-100'>
            ${product.price}.00
          </span>
          {product.originalPrice && product.originalPrice !== product.price && (
            <span className='text-sm text-muted-foreground dark:text-yellow-100 line-through'>
              ${product.originalPrice}.00
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          className='w-full bg-primary dark:bg-yellow-500 text-primary-foreground dark:text-gray-900 hover:bg-primary/90 dark:hover:bg-yellow-400 py-2 px-4 rounded font-semibold transition-colors duration-150 disabled:opacity-50 text-sm'
          onClick={() => addToCart && addToCart(product, 1)}
          disabled={!addToCart}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default FeaturedHotDeal;
