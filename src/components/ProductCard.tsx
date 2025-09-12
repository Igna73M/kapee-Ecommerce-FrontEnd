import { Heart, Star } from "lucide-react";
import { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  addToCart?: (product: Product, quantity?: number) => void;
  wishlist?: string[];
  toggleWishlist?: (productId: string) => void;
}

const ProductCard = ({
  product,
  onProductClick,
  addToCart,
  wishlist = [],
  toggleWishlist,
}: ProductCardProps) => {
  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className='bg-white rounded-lg border hover:shadow-lg transition-all duration-300 group relative overflow-hidden'>
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <span className='absolute top-3 left-3 z-10 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded'>
          {discountPercentage}% Off
        </span>
      )}

      {/* Featured Badge - Check if it's a featured product (could be marked different ways) */}
      {product.discount && product.discount > 30 && (
        <span className='absolute top-3 right-3 z-10 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded'>
          Featured
        </span>
      )}

      {/* Wishlist Button */}
      <button
        className='absolute top-3 right-3 z-10 bg-white/80 hover:bg-red-100 rounded-full p-2 transition-colors duration-150 shadow'
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
          className={`h-5 w-5 ${
            wishlist?.includes(product.id)
              ? "text-red-500 fill-red-500"
              : "text-gray-400"
          }`}
        />
      </button>

      {/* Product Image */}
      <div
        className='aspect-square overflow-hidden bg-gray-50 cursor-pointer'
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
        <div className='text-xs text-primary font-medium uppercase tracking-wide'>
          {product.category}
        </div>

        {/* Product Name */}
        <h3
          className='font-semibold text-lg leading-tight cursor-pointer hover:text-primary transition-colors'
          onClick={() => onProductClick(product)}
        >
          {product.name}
        </h3>

        {/* Features/Highlights */}
        {product.features && product.features.length > 0 && (
          <div className='text-sm text-muted-foreground'>
            <div className='font-medium mb-1'>Highlights:</div>
            <ul className='space-y-1'>
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className='text-xs flex items-start'>
                  <span className='w-1 h-1 bg-muted-foreground rounded-full mr-2 mt-2 flex-shrink-0'></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rating */}
        {product.rating && (
          <div className='flex items-center gap-1'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating!)
                    ? "fill-primary text-primary"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className='text-sm text-muted-foreground ml-1'>
              ({product.rating})
            </span>
          </div>
        )}

        {/* Price */}
        <div className='flex items-center gap-2'>
          <span className='text-xl font-bold text-foreground'>
            ${product.price}.00
            {product.originalPrice &&
              product.originalPrice !== product.price && (
                <span className='text-lg'> – ${product.originalPrice}.00</span>
              )}
          </span>
          {product.originalPrice &&
            product.originalPrice !== product.price &&
            discountPercentage > 0 && (
              <span className='text-sm text-muted-foreground line-through'>
                ${product.originalPrice}.00
              </span>
            )}
        </div>

        {/* Add to Cart Button */}
        <button
          className='w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded font-semibold transition-colors duration-150 disabled:opacity-50'
          onClick={() => addToCart && addToCart(product, 1)}
          disabled={!addToCart}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
