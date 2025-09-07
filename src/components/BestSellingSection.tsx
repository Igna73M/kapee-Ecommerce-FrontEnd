import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { products } from "@/data/products";
import { Product } from "@/types/product";

interface BestSellingSectionProps {
  onProductClick: (product: Product) => void;
  wishlist?: string[];
  toggleWishlist?: (productId: string) => void;
}

const BestSellingSection = ({
  onProductClick,
  wishlist = [],
  toggleWishlist,
}: BestSellingSectionProps) => {
  // Show products 3-8 as best selling (different from hot deals)
  const bestSellingProducts = products.slice(3, 9);

  const BestSellingCard = ({ product }: { product: Product }) => {
    const discountPercentage = product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

    // Mock data for sold/available quantities
    const soldQuantity = 50;
    const availableQuantity = 75;
    const totalQuantity = soldQuantity + availableQuantity;
    const progressValue = (soldQuantity / totalQuantity) * 100;

    return (
      <div className='bg-card rounded-lg border-2 border-yellow-400 hover:shadow-lg transition-all duration-300 group relative overflow-hidden h-full'>
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <Badge className='absolute top-3 left-3 z-10 bg-green-500 text-white'>
            {discountPercentage}% OFF
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

          {/* Price */}
          <div className='flex items-center gap-2'>
            <span className='text-xl font-bold text-foreground'>
              ${product.price}.00
            </span>
            {product.originalPrice &&
              product.originalPrice !== product.price && (
                <>
                  <span className='text-lg font-bold text-foreground'> – </span>
                  <span className='text-xl font-bold text-foreground'>
                    ${product.originalPrice}.00
                  </span>
                </>
              )}
          </div>

          {/* Availability Progress */}
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>
                Already Sold:{" "}
                <span className='font-semibold text-foreground'>
                  {soldQuantity}
                </span>
              </span>
              <span className='text-muted-foreground'>
                Available:{" "}
                <span className='font-semibold text-foreground'>
                  {availableQuantity}
                </span>
              </span>
            </div>
            <Progress value={progressValue} className='h-2' />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold'>BEST SELLING PRODUCTS</h2>
        <Button variant='outline'>View All</Button>
      </div>

      <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
        {bestSellingProducts.map((product) => (
          <BestSellingCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default BestSellingSection;
