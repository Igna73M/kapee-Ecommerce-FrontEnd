import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { toast } from "@/components/ui/use-toast";

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
        <Badge className='absolute top-3 left-3 z-10 bg-green-500 text-white'>
          {discountPercentage}% Off
        </Badge>
      )}

      {/* Featured Badge - Check if it's a featured product (could be marked different ways) */}
      {product.discount && product.discount > 30 && (
        <Badge className='absolute top-3 right-3 z-10 bg-blue-500 text-white'>
          Featured
        </Badge>
      )}

      {/* Wishlist Button */}
      <Button
        variant='ghost'
        size='icon'
        className='absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white'
        onClick={(e) => {
          e.stopPropagation();
          if (toggleWishlist) toggleWishlist(product.id);
          toast({
            title: wishlist.includes(product.id)
              ? "Removed from Wishlist"
              : "Added to Wishlist",
            description: `${product.name} ${
              wishlist.includes(product.id) ? "removed from" : "added to"
            } your wishlist.`,
          });
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
        <Button
          className='w-full bg-primary text-primary-foreground hover:bg-primary/90'
          onClick={() => addToCart && addToCart(product, 1)}
          disabled={!addToCart}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
