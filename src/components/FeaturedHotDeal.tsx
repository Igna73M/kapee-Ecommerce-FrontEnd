import { Heart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../types/product";

interface BrandCategory {
  _id: string;
  name: string;
}

interface FeaturedHotDealProps {
  onProductClick: (product: Product) => void;
  addToCart?: (product: Product, quantity?: number) => void;
  openCart?: () => void;
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

const FeaturedHotDeal = ({
  onProductClick,
  addToCart,
  openCart,
}: FeaturedHotDealProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brandCategories, setBrandCategories] = useState<BrandCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistUpdating, setWishlistUpdating] = useState(false);
  const [localWishlist, setLocalWishlistState] = useState<string[]>(
    getLocalWishlist()
  );

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:5000/api_v1/products"),
      axios.get("http://localhost:5000/api_v1/brand-categories"),
    ])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.data);
        setBrandCategories(catRes.data);
      })
      .catch(() => {
        setProducts([]);
        setBrandCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Find the first featured product (discount > 30)
  const product = products.find((p) => p.discount && p.discount > 30);

  // Get category name from _id
  const getCategoryName = (categoryId: string) => {
    const cat = brandCategories.find((c) => c._id === categoryId);
    return cat ? cat.name : categoryId;
  };

  // Wishlist handler (sync localStorage + backend)
  const handleToggleWishlist = async () => {
    if (!product || !product._id) return;
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
    setTimeout(() => setWishlistUpdating(false), 600);
  };
  if (loading || !product) {
    return (
      <div className='flex items-center justify-center min-h-[200px]'>
        <span>Loading featured product...</span>
      </div>
    );
  }

  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const handleAddToCart = async () => {
    setAddingToCart(true);

    // 1. Update local storage (ensure no duplicate product entries)
    interface CartItem {
      productId: string;
      name: string;
      quantity: number;
    }
    const cart: CartItem[] = JSON.parse(
      localStorage.getItem("localCart") || "[]"
    );
    const productId = product._id;
    const productName = product.name;
    const existingIndex = cart.findIndex(
      (item) => item.productId === productId
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ productId, name: productName, quantity: 1 });
    }
    localStorage.setItem("localCart", JSON.stringify(cart));

    // 2. Get accessToken from cookies
    const accessToken = getCookie("accessToken");

    // 3. Update backend with Authorization header
    try {
      await axios.post(
        "http://localhost:5000/api_v1/carts/add",
        {
          productId,
          quantity: 1,
        },
        {
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Failed to add to cart on backend", err);
    }

    // 4. Call parent addToCart if provided
    if (addToCart) {
      await addToCart(product, 1);
    }

    setAddingToCart(false);

    // 5. Trigger cart modal
    if (openCart) {
      openCart();
    }
  };

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
      <div className='p-3 space-y-2'>
        {/* Category */}
        <div className='text-xs text-primary dark:text-yellow-400 font-medium uppercase tracking-wide'>
          {getCategoryName(product.category)}
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
          className='w-full bg-primary dark:bg-yellow-500 text-primary-foreground dark:text-gray-900 hover:bg-primary/90 dark:hover:bg-yellow-400 py-2 px-4 rounded font-semibold transition-colors duration-150 disabled:opacity-50 text-sm flex items-center justify-center gap-2'
          onClick={handleAddToCart}
          disabled={addingToCart}
        >
          {addingToCart ? <span className='loader h-4 w-4' /> : "Add to cart"}
        </button>
      </div>
    </div>
  );
};

export default FeaturedHotDeal;
