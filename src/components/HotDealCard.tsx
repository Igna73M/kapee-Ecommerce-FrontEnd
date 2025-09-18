import { Heart, Star, Shuffle, ShoppingCart, ZoomIn } from "lucide-react";
import { Product } from "../types/product";

interface HotDealCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  addToCart?: (product: Product, quantity?: number) => void;
  wishlist?: string[];
  toggleWishlist?: (productId: string) => void;
}

const HotDealCard = ({
  product,
  onProductClick,
  addToCart,
  wishlist = [],
  toggleWishlist,
}: HotDealCardProps) => {
  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className='bg-card dark:bg-gray-800 rounded-lg border dark:border-yellow-600 hover:shadow-lg transition-all duration-300 group relative overflow-hidden'>
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <span className='absolute top-3 left-3 z-10 bg-green-500 text-white inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-green-500/80'>
          {discountPercentage}% Off
        </span>
      )}

      {/* Featured Badge */}
      {product.discount && product.discount > 30 && (
        <span className='absolute top-3 right-3 z-10 bg-blue-500 text-white inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-blue-500/80'>
          Featured
        </span>
      )}

      {/* Wishlist Button */}
      <button
        className='absolute bg-white/80 dark:bg-gray-900/80 hover:bg-red-100 dark:hover:bg-yellow-600 rounded-full p-2 duration-150 shadow top-3 right-3 z-10 opacity-0 group-hover:opacity-100 inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'
        onClick={(e) => {
          e.stopPropagation();
          if (toggleWishlist) {
            toggleWishlist(product.id);
          }
        }}
        aria-label={
          wishlist?.includes(product.id)
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
      >
        <Heart
          className={`h-4 w-4 ${
            wishlist?.includes(product.id)
              ? "text-red-500 fill-red-500"
              : "text-gray-400 dark:text-yellow-100"
          }`}
        />
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
      <div className='p-4 space-y-3'>
        {/* Category */}
        <div className='text-xs text-primary dark:text-yellow-400 font-medium uppercase tracking-wide'>
          {product.category}
        </div>

        {/* Product Name */}
        <h3
          className='font-semibold text-lg leading-tight cursor-pointer hover:text-primary dark:hover:text-yellow-400 transition-colors text-gray-900 dark:text-yellow-100'
          onClick={() => onProductClick(product)}
        >
          {product.name}
        </h3>

        {/* Price */}
        <div className='flex items-center gap-2'>
          <span className='text-xl font-bold text-foreground dark:text-yellow-100'>
            ${product.price}.00
            {product.originalPrice &&
              product.originalPrice !== product.price && (
                <span className='text-lg'> – ${product.originalPrice}.00</span>
              )}
          </span>
          {product.originalPrice &&
            product.originalPrice !== product.price &&
            discountPercentage > 0 && (
              <span className='text-sm text-muted-foreground dark:text-yellow-100 line-through'>
                ${product.originalPrice}.00
              </span>
            )}
        </div>

        {/* Action Buttons (show only on hover) */}
        <div className='flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200'>
          <button className='w-full py-2 px-4 rounded font-semibold transition-colors duration-150 disabled:opacity-50 mt-2 bg-yellow-400 dark:bg-yellow-600 border-yellow-400 dark:border-yellow-600 text-black dark:text-gray-900 hover:bg-yellow-500 dark:hover:bg-yellow-500 hover:border-yellow-500 dark:hover:border-yellow-500'>
            <Shuffle className='h-4 w-4' />
          </button>

          <button
            className='flex-1 bg-yellow-400 dark:bg-yellow-600 text-black dark:text-gray-900 hover:bg-yellow-500 dark:hover:bg-yellow-500 w-full py-2 px-4 rounded font-semibold transition-colors duration-150 disabled:opacity-50 mt-2'
            onClick={() => addToCart && addToCart(product, 1)}
            disabled={!addToCart}
          >
            <ShoppingCart className='h-4 w-4 mr-2' />
          </button>

          <button className='bg-yellow-400 dark:bg-yellow-600 border-yellow-400 dark:border-yellow-600 text-black dark:text-gray-900 hover:bg-yellow-500 dark:hover:bg-yellow-500 hover:border-yellow-500 dark:hover:border-yellow-500 w-full py-2 px-4 rounded font-semibold transition-colors duration-150 disabled:opacity-50 mt-2'>
            <ZoomIn />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotDealCard;
