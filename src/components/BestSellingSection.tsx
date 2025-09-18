import { Heart, Star } from "lucide-react";
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
      <div className='bg-card dark:bg-gray-800 rounded-lg border-2 border-yellow-400 dark:border-yellow-600 hover:shadow-lg transition-all duration-300 group relative overflow-hidden h-full'>
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className='absolute top-3 left-3 z-10 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded inline-flex items-center border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent'>
            {discountPercentage}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          className='absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 dark:bg-gray-900/80 hover:bg-background dark:hover:bg-gray-800 rounded-full p-2'
          onClick={(e) => {
            e.stopPropagation();
            if (toggleWishlist) toggleWishlist(product.id);
          }}
          aria-label={
            wishlist.includes(product.id)
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          type='button'
        >
          <Heart
            className={`h-4 w-4 ${
              wishlist.includes(product.id)
                ? "text-red-500 fill-red-500"
                : "dark:text-yellow-100"
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
            </span>
            {product.originalPrice &&
              product.originalPrice !== product.price && (
                <>
                  <span className='text-lg font-bold text-foreground dark:text-yellow-100'>
                    {" "}
                    –{" "}
                  </span>
                  <span className='text-xl font-bold text-foreground dark:text-yellow-100'>
                    ${product.originalPrice}.00
                  </span>
                </>
              )}
          </div>

          {/* Availability Progress */}
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground dark:text-yellow-100'>
                Already Sold:{" "}
                <span className='font-semibold text-foreground dark:text-yellow-100'>
                  {soldQuantity}
                </span>
              </span>
              <span className='text-muted-foreground dark:text-yellow-100'>
                Available:{" "}
                <span className='font-semibold text-foreground dark:text-yellow-100'>
                  {availableQuantity}
                </span>
              </span>
            </div>
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded h-2 overflow-hidden'>
              <div
                className='bg-yellow-400 dark:bg-yellow-600 h-2 rounded'
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold text-gray-900 dark:text-yellow-100'>
          BEST SELLING PRODUCTS
        </h2>
        <button
          className='border border-gray-300 dark:border-gray-700 rounded px-4 py-2 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-semibold transition-colors duration-150 text-gray-900 dark:text-yellow-100'
          type='button'
        >
          View All
        </button>
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
