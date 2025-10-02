import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "@/types/product";
import ProductModal from "./ProductModal";
import { useNavigate } from "react-router-dom";

interface BrandCategory {
  _id: string;
  name: string;
}

const BestSellingSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brandCategories, setBrandCategories] = useState<BrandCategory[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistUpdatingId, setWishlistUpdatingId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper to get category name by _id
  const getCategoryName = (categoryId: string) => {
    const cat = brandCategories.find((c) => c._id === categoryId);
    return cat ? cat.name : "Unknown";
  };

  function getAccessTokenFromCookie() {
    const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  useEffect(() => {
    setLoading(true);

    const fetchAll = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(
            `https://kapee-ecommerce-backend.onrender.com/api_v1/products`
          ),
          axios.get(
            `https://kapee-ecommerce-backend.onrender.com/api_v1/brand-categories`
          ),
        ]);
        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
        setBrandCategories(
          Array.isArray(categoriesRes.data) ? categoriesRes.data : []
        );
      } catch {
        setProducts([]);
        setBrandCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Only use wishlist for toggling, not for display
  const toggleWishlist = async (productId: string) => {
    setWishlistUpdatingId(productId);
    const token = getAccessTokenFromCookie();
    try {
      let updatedWishlist: string[];
      if (wishlist.includes(productId)) {
        await axios.delete(
          `https://kapee-ecommerce-backend.onrender.com/api_v1/wishlist/remove/${productId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        updatedWishlist = wishlist.filter((id) => id !== productId);
      } else {
        await axios.post(
          `https://kapee-ecommerce-backend.onrender.com/api_v1/wishlist/add`,
          { productId },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        updatedWishlist = [...wishlist, productId];
      }
      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    } catch {
      // Silently fail, do not block UI
    } finally {
      setWishlistUpdatingId(null);
    }
  };

  // Best selling: products 3-8
  const bestSellingProducts = products.slice(3, 9);

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const BestSellingCard = ({ product }: { product: Product }) => {
    const discountPercentage = product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

    const isWishlistUpdating = wishlistUpdatingId === product._id;

    const handleToggleWishlist = async () => {
      await toggleWishlist(product._id);
    };

    // Use modal instead of navigation
    const handleViewProduct = () => {
      openProductModal(product);
    };

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
            handleToggleWishlist();
          }}
          aria-label={
            wishlist.includes(product._id)
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          type='button'
          disabled={isWishlistUpdating}
        >
          {isWishlistUpdating ? (
            <span className='loader h-4 w-4' />
          ) : (
            <Heart
              className={`h-4 w-4 ${
                wishlist.includes(product._id)
                  ? "text-red-500 fill-red-500"
                  : "dark:text-yellow-100"
              }`}
            />
          )}
        </button>

        {/* Product Image */}
        <div
          className='aspect-square overflow-hidden bg-muted dark:bg-gray-700 cursor-pointer'
          onClick={handleViewProduct}
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
            {getCategoryName(product.category)}
          </div>

          {/* Product Name */}
          <h3
            className='font-semibold text-lg leading-tight cursor-pointer hover:text-primary dark:hover:text-yellow-400 transition-colors text-gray-900 dark:text-yellow-100'
            onClick={handleViewProduct}
          >
            {product.name}
          </h3>

          {/* Price */}
          <div className='flex items-center gap-2'>
            <span className='text-xl font-bold text-foreground dark:text-yellow-100'>
              ${product.price?.toFixed(2) ?? "0.00"}
            </span>
            {product.originalPrice &&
              product.originalPrice !== product.price && (
                <>
                  <span className='text-lg font-bold text-foreground dark:text-yellow-100'>
                    {" "}
                    –{" "}
                  </span>
                  <span className='text-xl font-bold text-foreground dark:text-yellow-100 line-through'>
                    ${product.originalPrice?.toFixed(2) ?? "0.00"}
                  </span>
                </>
              )}
          </div>

          {/* Availability */}
          <div className='space-y-2'>
            {product.inStock === false ? (
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground dark:text-yellow-100'>
                  Already Sold
                </span>
              </div>
            ) : (
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground dark:text-yellow-100'>
                  In Stock
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[250px]'>
        <span>Loading best selling products...</span>
      </div>
    );
  }

  return (
    <section className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold text-gray-900 dark:text-yellow-100'>
          BEST SELLING PRODUCTS
        </h2>
        <button
          className='border border-gray-300 dark:border-gray-700 rounded px-4 py-2 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-semibold transition-colors duration-150 text-gray-900 dark:text-yellow-100'
          type='button'
          onClick={() => {
            navigate("/shop");
          }}
        >
          View All
        </button>
      </div>

      <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
        {bestSellingProducts.map((product) => (
          <BestSellingCard key={product._id} product={product} />
        ))}
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductModal}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
      />
    </section>
  );
};

export default BestSellingSection;
