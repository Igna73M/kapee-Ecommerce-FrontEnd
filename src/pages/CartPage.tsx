import React, { useEffect, useState } from "react";
import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Product } from "@/types/product";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

interface CartItem {
  product: Product;
  quantity: number;
}

const LOCAL_CART_KEY = "localCart";

function getLocalCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Helper to get accessToken from cookies
function getAccessTokenFromCookies(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const CartPage: React.FC = () => {
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const darkMode = localStorage.getItem("dashboardDarkMode") === "true";
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch cart from backend
  const fetchCart = async () => {
    setLoading(true);
    const token = getAccessTokenFromCookies();
    try {
      const res = await axios.get("http://localhost:5000/api_v1/carts/", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (Array.isArray(res.data.items) && res.data.items.length > 0) {
        const items: CartItem[] = res.data.items.map(
          (item: { product: Product; quantity: number }) => ({
            product: item.product,
            quantity: item.quantity,
          })
        );
        setCartData(items);
      } else {
        setCartData(getLocalCart());
      }
    } catch (err) {
      setCartData(getLocalCart());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  // Remove item from cart (backend sync)
  const removeFromCart = async (productId: string) => {
    const token = getAccessTokenFromCookies();
    try {
      await axios.delete("http://localhost:5000/api_v1/carts/remove", {
        data: { productId },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      await fetchCart();
    } catch (err) {
      // Optionally show error/toast
    }
  };

  // Update item quantity in cart (backend sync)
  const updateCartQuantity = async (productId: string, quantity: number) => {
    const token = getAccessTokenFromCookies();
    try {
      await axios.patch(
        "http://localhost:5000/api_v1/carts/update",
        { productId, quantity },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      await fetchCart();
    } catch (err) {
      // Optionally show error/toast
    }
  };

  // Filter out invalid cart items
  const validCartData = cartData.filter(
    (item) => item.product && typeof item.product.price === "number"
  );

  const subtotal = validCartData.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );

  return (
    <div className='min-h-screen bg-background dark:bg-gray-900'>
      <TopBanner />
      <main className='max-w-7xl mx-auto py-8 px-4'>
        <h1 className='text-2xl font-bold mb-6 text-gray-900 dark:text-yellow-100'>
          Your Cart
        </h1>
        {loading ? (
          <div className='text-center text-muted-foreground dark:text-yellow-100 py-12'>
            Loading cart...
          </div>
        ) : validCartData.length === 0 ? (
          <div className='text-center text-muted-foreground dark:text-yellow-100 py-12'>
            Your cart is empty.
            <div className='mt-4'>
              <button
                onClick={() => navigate("/shop")}
                className='inline-flex items-center px-4 py-2 bg-primary text-white rounded'
              >
                Continue shopping
              </button>
            </div>
          </div>
        ) : (
          <div className='space-y-6'>
            {validCartData.map((item) => (
              <div
                key={item.product._id}
                className='flex items-center gap-4 border dark:border-gray-700 rounded p-3 bg-white dark:bg-gray-800'
              >
                {item.product.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className='w-16 h-16 object-cover rounded'
                  />
                ) : (
                  <div className='w-16 h-16 bg-muted dark:bg-gray-700 rounded flex items-center justify-center text-sm text-gray-900 dark:text-yellow-100'>
                    img
                  </div>
                )}
                <div className='flex-1'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <div className='font-medium text-gray-900 dark:text-yellow-100'>
                        {item.product.name}
                      </div>
                      <div className='text-sm text-muted-foreground dark:text-yellow-100'>
                        {item.product.category || ""}
                      </div>
                    </div>
                    <div className='font-semibold text-gray-900 dark:text-yellow-100'>
                      ${(item.product.price || 0).toFixed(2)}
                    </div>
                  </div>
                  <div className='mt-3 flex items-center gap-3'>
                    <div className='flex items-center border dark:border-gray-700 rounded'>
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.product._id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className='px-2 py-1 text-gray-900 dark:text-yellow-100'
                      >
                        −
                      </button>
                      <div className='px-3 text-gray-900 dark:text-yellow-100'>
                        {item.quantity}
                      </div>
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.product._id,
                            item.quantity + 1
                          )
                        }
                        className='px-2 py-1 text-gray-900 dark:text-yellow-100'
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className='text-sm text-red-600 dark:text-red-400 hover:underline'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className='flex justify-between items-center border-t dark:border-gray-700 pt-4'>
              <span className='font-medium text-gray-900 dark:text-yellow-100'>
                Subtotal
              </span>
              <span className='text-xl font-bold text-gray-900 dark:text-yellow-100'>
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className='flex justify-end'>
              <button
                onClick={() =>
                  navigate("/checkout", { state: { cart: validCartData } })
                }
                className='py-2 px-6 bg-primary text-white rounded hover:bg-primary/90'
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default CartPage;
