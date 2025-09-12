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
    <div className='bg-card rounded-lg border hover:shadow-md transition-all duration-300 group relative overflow-hidden'>
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <span className='absolute top-2 left-2 z-10 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded'>
          {discountPercentage}% Off
        </span>
      )}

      {/* Featured Badge */}
      {product.discount && product.discount > 30 && (
        <span className='absolute top-2 right-2 z-10 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded'>
          Featured
        </span>
      )}

      {/* Wishlist Button */}
      <button
        className='absolute bottom-2 right-2 z-10 bg-white/80 hover:bg-red-100 rounded-full p-2 transition-colors duration-150 shadow opacity-0 group-hover:opacity-100'
        onClick={(e) => {
          e.stopPropagation();
          if (addToCart) {
            addToCart(product);
          }
        }}
        aria-label='Add to wishlist'
      >
        <Heart className='h-4 w-4 text-gray-400' />
      </button>
      <Heart className='h-3 w-3' />

      {/* Product Image */}
      <div
        className='aspect-square overflow-hidden bg-muted cursor-pointer'
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
        <div className='text-xs text-primary font-medium uppercase tracking-wide'>
          {product.category}
        </div>

        {/* Product Name */}
        <h3
          className='font-semibold text-base leading-tight cursor-pointer hover:text-primary transition-colors line-clamp-2'
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
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
            ))}
            <span className='text-xs text-muted-foreground ml-1'>
              ({product.rating})
            </span>
          </div>
        )}

        {/* Price */}
        <div className='flex items-center gap-2'>
          <span className='text-lg font-bold text-foreground'>
            ${product.price}.00
          </span>
          {product.originalPrice && product.originalPrice !== product.price && (
            <span className='text-sm text-muted-foreground line-through'>
              ${product.originalPrice}.00
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          className='w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded font-semibold transition-colors duration-150 disabled:opacity-50 text-sm'
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
