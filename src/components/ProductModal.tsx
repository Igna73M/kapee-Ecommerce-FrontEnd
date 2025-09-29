import { X, Heart, Minus, Plus, Star } from "lucide-react";
import { Product } from "@/types/product";
import { useState, useEffect } from "react";
import axios from "axios";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  addToCart?: (product: Product, quantity?: number) => void;
  openCart?: () => void;
  wishlist?: string[];
  toggleWishlist?: (productId: string) => void;
}

const LOCAL_CART_KEY = "localCart";
const LOCAL_WISHLIST_KEY = "wishlist";

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

function getLocalWishlist(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalWishlist(wishlist: string[]) {
  localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(wishlist));
}

function getAccessTokenFromCookies(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const ProductModal = ({
  product,
  isOpen,
  onClose,
  addToCart,
  openCart,
  wishlist = [],
  toggleWishlist,
}: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [cartId, setCartId] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [localWishlist, setLocalWishlistState] = useState<string[]>(
    getLocalWishlist()
  );

  useEffect(() => {
    setQuantity(1);
    setErrorMsg(null);
    setLocalWishlistState(getLocalWishlist());
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
    if (isOpen) fetchCartId();
  }, [isOpen, product]);

  if (!product || !isOpen) return null;

  // Add to cart handler (localStorage + backend)
  const handleAddToCart = async () => {
    setAddingToCart(true);
    setErrorMsg(null);

    if (!product.inStock || product.quantity < 1 || !product._id) {
      setErrorMsg("Product is out of stock or unavailable.");
      setAddingToCart(false);
      return;
    }

    // Local cart update
    const localCart = getLocalCart();
    const idx = localCart.findIndex((item) => item.product._id === product._id);
    if (idx > -1) {
      localCart[idx].quantity += quantity;
    } else {
      localCart.push({ product, quantity });
    }
    setLocalCart(localCart);

    // Backend cart update if logged in
    const token = getAccessTokenFromCookies();
    if (token) {
      try {
        // Check if product is already in cart (backend)
        let productInCart = false;
        if (cartId) {
          const cartRes = await axios.get(
            "http://localhost:5000/api_v1/carts/",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          interface CartProductItem {
            productId: string;
            quantity: number;
            // Add other properties if needed
          }

          if (
            Array.isArray(cartRes.data.products) &&
            cartRes.data.products.some(
              (item: CartProductItem) => item.productId === product._id
            )
          ) {
            productInCart = true;
          }
        }

        if (cartId && productInCart) {
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
            { productId: product._id, quantity },
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

    if (addToCart) await addToCart(product, quantity);
    setAddingToCart(false);
    onClose();
    if (openCart) openCart();
  };

  // Wishlist handler (sync localStorage + backend)
  const handleToggleWishlist = async () => {
    if (!product || !product._id) return;
    const token = getAccessTokenFromCookies();
    let updatedWishlist: string[] = [...localWishlist];

    // Optimistic UI update
    if (updatedWishlist.includes(product._id)) {
      updatedWishlist = updatedWishlist.filter((id) => id !== product._id);
    } else {
      updatedWishlist = [...updatedWishlist, product._id];
    }
    setLocalWishlist(updatedWishlist);
    setLocalWishlistState(updatedWishlist);

    // Backend sync
    try {
      if (token) {
        if (updatedWishlist.includes(product._id)) {
          await axios.post(
            "http://localhost:5000/api_v1/wishlist/add",
            { productId: product._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          await axios.delete(
            `http://localhost:5000/api_v1/wishlist/remove/${product._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
        // After backend response, update localStorage again for consistency
        setLocalWishlist(updatedWishlist);
        setLocalWishlistState(updatedWishlist);
      }
    } catch {
      // On error, revert localStorage to previous state
      const prevWishlist = getLocalWishlist();
      setLocalWishlist(prevWishlist);
      setLocalWishlistState(prevWishlist);
    }

    // If parent provided toggleWishlist, call it for UI sync
    if (toggleWishlist) {
      await toggleWishlist(product._id);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-gray-900/80'>
      <div className='bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6'>
        <button
          className='absolute top-4 right-4 text-gray-400 dark:text-yellow-100 hover:text-gray-700 dark:hover:text-yellow-400 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
          onClick={onClose}
          aria-label='Close'
        >
          <X className='h-6 w-6' />
        </button>
        <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-yellow-100'>
          {product.name}
        </h2>
        <div className='grid md:grid-cols-2 gap-8'>
          {/* Product Image */}
          <div className='relative'>
            {product.discount && (
              <span className='absolute top-4 left-4 z-10 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded'>
                {product.discount}% Off
              </span>
            )}
            <div className='aspect-square overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-700'>
              <img
                src={product.image}
                alt={product.name}
                className='w-full h-full object-cover'
              />
            </div>
          </div>

          {/* Product Details */}
          <div className='space-y-6'>
            <div>
              <div className='text-sm text-muted-foreground dark:text-yellow-100 mb-2'>
                {product.category}
              </div>
              <h1 className='text-3xl font-bold mb-4 text-gray-900 dark:text-yellow-100'>
                {product.name}
              </h1>

              {product.rating && (
                <div className='flex items-center gap-2 mb-4'>
                  <div className='flex items-center gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating!)
                            ? "fill-primary text-primary dark:fill-yellow-400 dark:text-yellow-400"
                            : "text-muted-foreground dark:text-yellow-100"
                        }`}
                      />
                    ))}
                  </div>
                  <span className='text-sm text-muted-foreground dark:text-yellow-100'>
                    ({product.rating}) Rating
                  </span>
                </div>
              )}
            </div>
            {/* Price */}
            <div className='flex items-center gap-3'>
              <span className='text-3xl font-bold text-primary dark:text-yellow-400'>
                ${product.price}.00
              </span>
              {product.originalPrice && (
                <span className='text-lg text-muted-foreground dark:text-yellow-100 line-through'>
                  ${product.originalPrice}.00
                </span>
              )}
              {product.discount && (
                <span className='bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded'>
                  Save {product.discount}%
                </span>
              )}
            </div>
            {/* Description */}
            <p className='text-muted-foreground dark:text-yellow-100'>
              {product.description}
            </p>
            {/* Features */}
            {product.features && (
              <div>
                <h3 className='font-semibold mb-3 text-gray-900 dark:text-yellow-100'>
                  Key Features:
                </h3>
                <ul className='space-y-2'>
                  {product.features.map((feature, index) => (
                    <li
                      key={index}
                      className='flex items-center text-sm text-gray-900 dark:text-yellow-100'
                    >
                      <span className='w-2 h-2 bg-primary dark:bg-yellow-400 rounded-full mr-3'></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Quantity Selector */}
            <div className='flex items-center gap-4'>
              <span className='font-medium text-gray-900 dark:text-yellow-100'>
                Quantity:
              </span>
              <div className='flex items-center border dark:border-gray-700 rounded-lg'>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className='h-10 w-10 flex items-center justify-center bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-lg transition-colors duration-150'
                  type='button'
                  aria-label='Decrease quantity'
                >
                  <Minus className='h-4 w-4' />
                </button>
                <span className='px-4 py-2 min-w-12 text-center text-gray-900 dark:text-yellow-100'>
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(
                      product.quantity
                        ? Math.min(product.quantity, quantity + 1)
                        : quantity + 1
                    )
                  }
                  className='h-10 w-10 flex items-center justify-center bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-lg transition-colors duration-150'
                  type='button'
                  aria-label='Increase quantity'
                  disabled={
                    product.quantity ? quantity >= product.quantity : false
                  }
                >
                  <Plus className='h-4 w-4' />
                </button>
              </div>
            </div>
            {/* Error Message */}
            {errorMsg && (
              <div className='text-xs text-red-600 dark:text-red-400 mb-2'>
                {errorMsg}
              </div>
            )}
            {/* Action Buttons */}
            <div className='flex gap-4'>
              <button
                className='flex-1 bg-primary dark:bg-yellow-500 text-primary-foreground dark:text-gray-900 hover:bg-primary/90 dark:hover:bg-yellow-400 py-2 px-4 rounded font-semibold transition-colors duration-150 disabled:opacity-50 text-sm'
                onClick={handleAddToCart}
                disabled={
                  addingToCart ||
                  !addToCart ||
                  !product.inStock ||
                  product.quantity < 1 ||
                  !product._id
                }
                type='button'
              >
                {addingToCart
                  ? "Adding..."
                  : `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
              </button>
              <button
                className={`flex items-center justify-center border rounded px-4 py-2 font-semibold text-sm transition-colors duration-150 ${
                  localWishlist.includes(product._id)
                    ? "bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-600 text-red-600 dark:text-red-400"
                    : "bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-yellow-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                onClick={handleToggleWishlist}
                type='button'
                disabled={!product._id}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${
                    localWishlist.includes(product._id)
                      ? "text-red-500 fill-red-500"
                      : "dark:text-yellow-100"
                  }`}
                />
                {localWishlist.includes(product._id)
                  ? "Wishlisted"
                  : "Wishlist"}
              </button>
            </div>
            {/* Stock Status */}
            <div className='flex items-center gap-2'>
              <div
                className={`w-3 h-3 rounded-full ${
                  product.inStock ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className='text-sm text-gray-900 dark:text-yellow-100'>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
