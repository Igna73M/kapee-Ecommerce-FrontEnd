import { Heart, Star, Shuffle, ShoppingCart, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../types/product";

interface BrandCategory {
  _id: string;
  name: string;
}

interface HotDealCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  addToCart?: (product: Product, quantity?: number) => void;
  wishlist?: string[];
  toggleWishlist?: (productId: string) => void;
}

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
  return null;
}

function getLocalWishlist(): string[] {
  try {
    const raw = localStorage.getItem("wishlist");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalWishlist(wishlist: string[]) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

const HotDealCard = ({
  product,
  onProductClick,
  addToCart,
  wishlist = [],
  toggleWishlist,
}: HotDealCardProps) => {
  const [brandCategories, setBrandCategories] = useState<BrandCategory[]>([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistUpdating, setWishlistUpdating] = useState(false);
  const [localWishlist, setLocalWishlistState] = useState<string[]>(
    getLocalWishlist()
  );

  useEffect(() => {
    axios
      .get("http://localhost:5000/api_v1/brand-categories")
      .then((res) => setBrandCategories(res.data))
      .catch(() => setBrandCategories([]));
  }, []);

  // Get category name from _id
  const getCategoryName = (categoryId: string) => {
    const cat = brandCategories.find((c) => c._id === categoryId);
    return cat ? cat.name : categoryId;
  };

  // Use addToCart from props (parent handles backend and state)
  const handleAddToCart = async () => {
    if (!addToCart) return;
    setAddingToCart(true);
    await addToCart(product, 1);
    setAddingToCart(false);
  };

  // Wishlist handler (sync localStorage + backend)
  const handleToggleWishlist = async () => {
    setWishlistUpdating(true);
    const accessToken = getCookie("accessToken");
    let updatedWishlist: string[] = [...localWishlist];
    const isCurrentlyWishlisted = updatedWishlist.includes(product._id);

    // Optimistic UI update
    if (isCurrentlyWishlisted) {
      updatedWishlist = updatedWishlist.filter((id) => id !== product._id);
    } else {
      updatedWishlist = [...updatedWishlist, product._id];
    }
    setLocalWishlist(updatedWishlist);
    setLocalWishlistState(updatedWishlist);

    // Backend sync
    try {
      if (accessToken) {
        if (!isCurrentlyWishlisted) {
          await axios.post(
            "http://localhost:5000/api_v1/wishlist/add",
            { productId: product._id },
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
        } else {
          await axios.delete(
            `http://localhost:5000/api_v1/wishlist/remove/${product._id}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
        }
        setLocalWishlist(updatedWishlist);
        setLocalWishlistState(updatedWishlist);
      }
    } catch {
      // On error, revert localStorage to previous state
      const prevWishlist = getLocalWishlist();
      setLocalWishlist(prevWishlist);
      setLocalWishlistState(prevWishlist);
    }
    setWishlistUpdating(false);

    // If parent provided toggleWishlist, call it for UI sync
    if (toggleWishlist) {
      await toggleWishlist(product._id);
    }
  };

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
          handleToggleWishlist();
        }}
        aria-label={
          localWishlist.includes(product._id)
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        disabled={wishlistUpdating}
      >
        {wishlistUpdating ? (
          <span className='loader h-4 w-4' />
        ) : (
          <Heart
            className={`h-4 w-4 ${
              localWishlist.includes(product._id)
                ? "text-red-500 fill-red-500"
                : "text-gray-400 dark:text-yellow-100"
            }`}
          />
        )}
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
          {getCategoryName(product.category)}
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
      </div>
    </div>
  );
};

export default HotDealCard;
