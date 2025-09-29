import { Heart, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Product } from "../types/product";
import axios from "axios";

interface BrandCategory {
  _id: string;
  name: string;
}

interface ProductCardProps {
  product: Product;
  onProductClick: (product: Product) => void;
  addToCart?: (product: Product, quantity?: number) => void;
  wishlist?: string[];
  toggleWishlist?: (productId: string) => void;
}

const LOCAL_CART_KEY = "localCart";

function getLocalCart(): { product: Product; quantity: number }[] {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalCart(cart: { product: Product; quantity: number }[]) {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
}

// Helper to get accessToken from cookies
function getAccessTokenFromCookies(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
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

  const [brandCategories, setBrandCategories] = useState<BrandCategory[]>([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlistUpdating, setWishlistUpdating] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api_v1/brand-categories")
      .then((res) => setBrandCategories(res.data))
      .catch(() => setBrandCategories([]));
    // Fetch cartId if logged in
    const fetchCartId = async () => {
      const token = getAccessTokenFromCookies();
      if (token) {
        try {
          const res = await axios.get("http://localhost:5000/api_v1/carts/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data && res.data._id) setCartId(res.data._id);
        } catch {
          setCartId(null);
        }
      }
    };
    fetchCartId();
  }, []);

  // Get category name from _id
  const getCategoryName = (categoryId: string) => {
    const cat = brandCategories.find((c) => c._id === categoryId);
    return cat ? cat.name : categoryId;
  };

  // Add to cart handler (localStorage + backend)
  const handleAddToCart = async () => {
    setAddingToCart(true);
    setErrorMsg(null);

    // Prevent adding if out of stock or invalid
    if (!product.inStock || product.quantity < 1 || !product._id) {
      setErrorMsg("Product is out of stock or unavailable.");
      setAddingToCart(false);
      return;
    }

    // Local cart update
    const localCart = getLocalCart();
    const idx = localCart.findIndex((item) => item.product._id === product._id);
    if (idx > -1) {
      localCart[idx].quantity += 1;
    } else {
      localCart.push({ product, quantity: 1 });
    }
    setLocalCart(localCart);

    // Backend cart update if logged in
    const token = getAccessTokenFromCookies();
    if (token) {
      try {
        if (cartId) {
          await axios.patch(
            "http://localhost:5000/api_v1/carts/update",
            {
              cartId,
              productId: product._id,
              quantity:
                localCart[idx > -1 ? idx : localCart.length - 1].quantity,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          await axios.post(
            "http://localhost:5000/api_v1/carts/add",
            { productId: product._id, quantity: 1 },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      } catch (err) {
        setErrorMsg(
          err?.response?.data?.message ||
            "Failed to add to cart. Please try again."
        );
      }
    }

    if (addToCart) await addToCart(product, 1);
    setAddingToCart(false);
  };

  // Wishlist handler (per product)
  const handleToggleWishlist = async () => {
    if (!toggleWishlist) return;
    setWishlistUpdating(true);
    await toggleWishlist(product._id);
    setWishlistUpdating(false);
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg border dark:border-yellow-600 hover:shadow-lg transition-all duration-300 group relative overflow-hidden'>
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <span className='absolute top-3 left-3 z-10 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded'>
          {discountPercentage}% Off
        </span>
      )}

      {/* Featured Badge */}
      {product.discount && product.discount > 30 && (
        <span className='absolute top-3 right-3 z-10 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded'>
          Featured
        </span>
      )}

      {/* Wishlist Button */}
      <button
        className='absolute top-3 right-3 z-10 bg-white/80 dark:bg-gray-900/80 hover:bg-red-100 dark:hover:bg-yellow-600 rounded-full p-2 transition-colors duration-150 shadow'
        onClick={(e) => {
          e.stopPropagation();
          handleToggleWishlist();
        }}
        aria-label={
          wishlist?.includes(product._id)
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        disabled={wishlistUpdating}
      >
        {wishlistUpdating ? (
          <span className='loader h-5 w-5' />
        ) : (
          <Heart
            className={`h-5 w-5 ${
              wishlist?.includes(product._id)
                ? "text-red-500 fill-red-500"
                : "text-gray-400 dark:text-yellow-100"
            }`}
          />
        )}
      </button>

      {/* Product Image */}
      <div
        className='aspect-square overflow-hidden bg-gray-50 dark:bg-gray-700 cursor-pointer'
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

        {/* Features/Highlights */}
        {product.features && product.features.length > 0 && (
          <div className='text-sm text-muted-foreground dark:text-yellow-100'>
            <div className='font-medium mb-1'>Highlights:</div>
            <ul className='space-y-1'>
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className='text-xs flex items-start'>
                  <span className='w-1 h-1 bg-muted-foreground dark:bg-yellow-100 rounded-full mr-2 mt-2 flex-shrink-0'></span>
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
                    ? "fill-primary text-primary dark:fill-yellow-400 dark:text-yellow-400"
                    : "text-gray-300 dark:text-yellow-100"
                }`}
              />
            ))}
            <span className='text-sm text-muted-foreground dark:text-yellow-100 ml-1'>
              ({product.rating})
            </span>
          </div>
        )}

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

        {/* Stock Status */}
        <div className='text-xs font-semibold mt-1 mb-2'>
          {product.inStock && product.quantity > 0 ? (
            <span className='text-green-600 dark:text-green-400'>In stock</span>
          ) : (
            <span className='text-red-600 dark:text-red-400'>Out of stock</span>
          )}
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className='text-xs text-red-600 dark:text-red-400 mb-2'>
            {errorMsg}
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          className='w-full bg-primary dark:bg-yellow-500 text-primary-foreground dark:text-gray-900 hover:bg-primary/90 dark:hover:bg-yellow-400 py-2 px-4 rounded font-semibold transition-colors duration-150 disabled:opacity-50 flex items-center justify-center gap-2'
          onClick={handleAddToCart}
          disabled={
            addingToCart ||
            !product.inStock ||
            product.quantity < 1 ||
            !product._id
          }
        >
          {addingToCart ? <span className='loader h-5 w-5' /> : "Add to cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
