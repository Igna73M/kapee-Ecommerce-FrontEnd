import { Heart, Star, Shuffle, Eye, ShoppingCart, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Product } from "@/types/product";

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
    <div className='bg-card rounded-lg border hover:shadow-lg transition-all duration-300 group relative overflow-hidden'>
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <Badge className='absolute top-3 left-3 z-10 bg-green-500 text-white'>
          {discountPercentage}% Off
        </Badge>
      )}

      {/* Featured Badge */}
      {product.discount && product.discount > 30 && (
        <Badge className='absolute top-3 right-3 z-10 bg-blue-500 text-white'>
          Featured
        </Badge>
      )}

      {/* Wishlist Button */}
      <Button
        variant='ghost'
        size='icon'
        className='absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background'
        onClick={(e) => {
          e.stopPropagation();
          if (toggleWishlist) toggleWishlist(product.id);
        }}
        aria-label={
          wishlist.includes(product.id)
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
      >
        <Heart
          className={`h-4 w-4 ${
            wishlist.includes(product.id) ? "text-red-500 fill-red-500" : ""
          }`}
        />
      </Button>

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
                    : "text-muted-foreground"
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

        {/* Action Buttons */}
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='icon'
            className='bg-yellow-400 border-yellow-400 text-black hover:bg-yellow-500 hover:border-yellow-500'
          >
            <Shuffle className='h-4 w-4' />
          </Button>
          <Button
            className='flex-1 bg-yellow-400 text-black hover:bg-yellow-500'
            onClick={() => addToCart && addToCart(product, 1)}
            disabled={!addToCart}
          >
            <ShoppingCart className='h-4 w-4 mr-2' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='bg-yellow-400 border-yellow-400 text-black hover:bg-yellow-500 hover:border-yellow-500'
          >
            <ZoomIn />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HotDealCard;
