import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Product } from "@/types/product";
import axios from "axios";

type CartItem = {
  product: Product;
  quantity: number;
};

function getAccessTokenFromCookies(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function getLocalCart(): CartItem[] {
  try {
    const raw = localStorage.getItem("localCart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function Checkout() {
  useEffect(() => {
    const darkMode = localStorage.getItem("dashboardDarkMode") === "true";
    document.body.classList.toggle("dark", darkMode);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch cart from backend on mount
  useEffect(() => {
    async function fetchCart() {
      setLoading(true);
      const token = getAccessTokenFromCookies();
      try {
        const res = await axios.get(
          `https://kapee-ecommerce-backend.onrender.com/api_v1/carts/`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (
          res.data &&
          Array.isArray(res.data.items) &&
          res.data.items.length > 0
        ) {
          setCartId(res.data._id);
          const items: CartItem[] = res.data.items.map(
            (item: { product: Product; quantity: number }) => ({
              product: item.product,
              quantity: item.quantity,
            })
          );
          setCart(items);
        } else {
          setCart(getLocalCart());
          setCartId(null);
        }
      } catch (err) {
        setCart(getLocalCart());
        setCartId(null);
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, []);

  // Filter out valid and invalid cart items
  const validCart = cart.filter(
    (it) => it.product && typeof it.product.price === "number"
  );
  const invalidItems = cart.filter((it) => !it.product || !it.product._id);

  // Remove item from cart (backend sync if possible)
  const handleRemoveItem = async (id: string) => {
    const token = getAccessTokenFromCookies();
    if (cartId) {
      try {
        await axios.delete(
          `https://kapee-ecommerce-backend.onrender.com/api_v1/carts/remove`,
          {
            data: { cartId, productId: id },
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        // Refresh cart
        const res = await axios.get(
          `https://kapee-ecommerce-backend.onrender.com/api_v1/carts/`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (res.data && Array.isArray(res.data.items)) {
          setCart(
            res.data.items.map(
              (item: { product: Product; quantity: number }) => ({
                product: item.product,
                quantity: item.quantity,
              })
            )
          );
        }
      } catch {
        // fallback: remove locally
        setCart((prev) =>
          prev.filter((it) => it.product && it.product._id !== id)
        );
      }
    } else {
      setCart((prev) =>
        prev.filter((it) => it.product && it.product._id !== id)
      );
    }
  };

  // Update quantity (backend sync if possible)
  const handleQuantityChange = async (id: string, qty: number) => {
    if (qty < 1) return;
    const token = getAccessTokenFromCookies();
    if (cartId) {
      try {
        await axios.patch(
          `https://kapee-ecommerce-backend.onrender.com/api_v1/carts/update`,
          { cartId, productId: id, quantity: qty },
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        // Refresh cart
        const res = await axios.get(
          `https://kapee-ecommerce-backend.onrender.com/api_v1/carts/`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (res.data && Array.isArray(res.data.items)) {
          setCart(
            res.data.items.map(
              (item: { product: Product; quantity: number }) => ({
                product: item.product,
                quantity: item.quantity,
              })
            )
          );
        }
      } catch {
        // fallback: update locally
        setCart((prev) =>
          prev.map((it) =>
            it.product && it.product._id === id ? { ...it, quantity: qty } : it
          )
        );
      }
    } else {
      setCart((prev) =>
        prev.map((it) =>
          it.product && it.product._id === id ? { ...it, quantity: qty } : it
        )
      );
    }
  };

  const subtotal = useMemo(
    () =>
      validCart.reduce(
        (sum, it) => sum + (it.product?.price ?? 0) * (it.quantity ?? 0),
        0
      ),
    [validCart]
  );

  // Simple form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Payment fields (demo)
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  // Place order (send to backend)
  const handlePlaceOrder = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (validCart.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (invalidItems.length > 0) {
      setError(
        "Please remove unavailable items from your cart before placing the order."
      );
      return;
    }
    if (!name || !email || !address || !city || !postal || !country) {
      setError("Please fill all shipping fields.");
      return;
    }
    if (!cardNumber || !expiry || !cvc) {
      setError("Please fill all payment fields.");
      return;
    }

    // Use cartId if available, else send items array
    const orderPayload = cartId
      ? {
          cartId,
          shipping: { name, email, address, city, postal, country },
        }
      : {
          items: validCart.map((it) => ({
            product: it.product._id,
            quantity: it.quantity,
            price: it.product.price,
          })),
          shipping: { name, email, address, city, postal, country },
          total: subtotal,
        };

    setProcessing(true);

    try {
      const token = getAccessTokenFromCookies();
      await axios.post(
        `https://kapee-ecommerce-backend.onrender.com/api_v1/orders/`,
        orderPayload,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      // Delete cart from backend if cartId exists
      if (cartId && token) {
        try {
          await axios.delete(
            `https://kapee-ecommerce-backend.onrender.com/api_v1/carts/`,
            {
              headers: { Authorization: `Bearer ${token}` },
              data: { cartId },
            }
          );
        } catch (err) {
          // Ignore backend cart delete errors
          console.log(err);
        }
      }

      // Always remove localCart from localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("localCart");
        } catch {
          // Ignore localStorage errors
        }
      }
      setCart([]);
      navigate("/order-success", { state: { order: orderPayload } });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to place order.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className='min-h-screen bg-background dark:bg-gray-900'>
      <TopBanner />

      <main className='max-w-7xl mx-auto py-8 px-4'>
        <h1 className='text-2xl font-bold mb-6 text-gray-900 dark:text-yellow-100'>
          Checkout
        </h1>

        {/* Responsive: Order summary first on mobile, side on desktop */}
        <div className='flex flex-col md:grid md:grid-cols-3 gap-8'>
          {/* Order summary */}
          <aside className='bg-card dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8 md:mb-0 md:order-2 md:col-span-1'>
            <h2 className='text-lg font-medium mb-4 text-gray-900 dark:text-yellow-100'>
              Order summary
            </h2>

            {loading ? (
              <div className='text-sm text-muted-foreground dark:text-yellow-100'>
                Loading cart...
              </div>
            ) : validCart.length === 0 ? (
              <div className='text-sm text-muted-foreground dark:text-yellow-100'>
                Your cart is empty.
              </div>
            ) : (
              <div className='space-y-4'>
                {validCart.map((it) => (
                  <div
                    key={it.product._id}
                    className='flex flex-col items-center gap-3'
                  >
                    {/* Image always on top */}
                    <div className='w-full h-32 bg-muted dark:bg-gray-700 rounded overflow-hidden flex-shrink-0 flex items-center justify-center mb-2'>
                      {it.product.image ? (
                        <img
                          src={it.product.image}
                          alt={it.product.name}
                          className='w-auto h-full object-contain'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-xs text-muted-foreground dark:text-yellow-100'>
                          img
                        </div>
                      )}
                    </div>

                    <div className='flex flex-col w-full items-center'>
                      <div className='font-medium text-sm text-gray-900 dark:text-yellow-100 text-center'>
                        {it.product.name}
                      </div>
                      <div className='text-xs text-muted-foreground dark:text-yellow-100 flex items-center gap-2 justify-center'>
                        Qty:{" "}
                        <input
                          type='number'
                          min={1}
                          value={it.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              it.product._id,
                              Number(e.target.value)
                            )
                          }
                          className='w-12 border dark:border-gray-700 rounded px-1 py-0.5 text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100'
                        />
                        × ${Number(it.product.price ?? 0).toFixed(2)}
                      </div>
                    </div>

                    <div className='font-medium text-gray-900 dark:text-yellow-100'>
                      ${((it.product.price ?? 0) * it.quantity).toFixed(2)}
                    </div>
                    <button
                      type='button'
                      aria-label='Remove item'
                      className='mt-2 text-red-500 dark:text-red-400 hover:underline text-xs'
                      onClick={() => handleRemoveItem(it.product._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className='border-t dark:border-gray-700 pt-4'>
                  <div className='flex justify-between text-sm text-gray-900 dark:text-yellow-100'>
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-sm mt-2 text-gray-900 dark:text-yellow-100'>
                    <span>Shipping</span>
                    <span>—</span>
                  </div>
                  <div className='flex justify-between text-lg font-bold mt-4 text-gray-900 dark:text-yellow-100'>
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Shipping form */}
          <form
            className='bg-card dark:bg-gray-800 rounded-lg p-6 shadow-sm md:col-span-2 md:order-1'
            onSubmit={handlePlaceOrder}
            autoComplete='off'
          >
            <h2 className='text-lg font-medium mb-4 text-gray-900 dark:text-yellow-100'>
              Shipping details
            </h2>

            {error && (
              <div className='mb-4 text-sm text-red-600 dark:text-red-400'>
                {error}
              </div>
            )}

            {invalidItems.length > 0 && (
              <div className='mb-4 text-sm text-red-600 dark:text-red-400'>
                Some items in your cart are no longer available. Please remove
                them before placing your order.
              </div>
            )}

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <input
                className='border dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100'
                placeholder='Full name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete='name'
              />
              <input
                className='border dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100'
                placeholder='Email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete='email'
              />
              <input
                className='col-span-1 sm:col-span-2 border dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100'
                placeholder='Address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                autoComplete='street-address'
              />
              <input
                className='border dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100'
                placeholder='City'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                autoComplete='address-level2'
              />
              <input
                className='border dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100'
                placeholder='Postal code'
                value={postal}
                onChange={(e) => setPostal(e.target.value)}
                required
                autoComplete='postal-code'
              />
              <input
                className='border dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100'
                placeholder='Country'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                autoComplete='country'
              />
            </div>

            <div className='mt-6'>
              <h3 className='font-medium mb-2 text-gray-900 dark:text-yellow-100'>
                Payment
              </h3>
              <p className='text-sm text-muted-foreground dark:text-yellow-100 mb-3'>
                payment details are simulated for demo purposes. Use any card
                number.
              </p>

              <div className='space-y-3'>
                <input
                  className='border dark:border-gray-700 rounded px-3 py-2 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100'
                  placeholder='Card number (demo)'
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                  inputMode='numeric'
                  autoComplete='cc-number'
                  required
                />
                <div className='grid grid-cols-2 gap-3'>
                  <input
                    className='border dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100'
                    placeholder='MM/YY'
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    maxLength={5}
                    inputMode='numeric'
                    autoComplete='cc-exp'
                    required
                  />
                  <input
                    className='border dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100'
                    placeholder='CVC'
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    maxLength={4}
                    inputMode='numeric'
                    autoComplete='cc-csc'
                    required
                  />
                </div>
              </div>
            </div>

            <div className='mt-6 flex items-center gap-3'>
              <button
                type='submit'
                disabled={
                  processing ||
                  validCart.length === 0 ||
                  invalidItems.length > 0
                }
                className={`px-4 py-2 rounded text-white ${
                  processing ||
                  validCart.length === 0 ||
                  invalidItems.length > 0
                    ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {processing
                  ? "Processing…"
                  : `Place order — $${subtotal.toFixed(2)}`}
              </button>

              <button
                type='button'
                onClick={() => navigate(-1)}
                className='px-4 py-2 rounded border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-yellow-100'
              >
                Return to shop
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
