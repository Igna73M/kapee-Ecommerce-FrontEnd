import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Product } from "@/types/product";

type CartItem = {
  product: Product;
  quantity: number;
};

type CheckoutProps = {
  cart?: CartItem[];
  onPlaceOrder?: (order: {
    items: CartItem[];
    shipping: {
      name: string;
      email: string;
      address: string;
      city: string;
      postal: string;
      country: string;
    };
    total: number;
  }) => void;
};

export default function Checkout({
  cart: cartProp,
  onPlaceOrder,
}: CheckoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  // Try props -> location state -> localStorage -> empty
  const cartFromState = (location.state as { cart?: CartItem[] } | null)
    ?.cart as CartItem[] | undefined;
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from prop, location, or localStorage
  useEffect(() => {
    let localCart: CartItem[] | null = null;
    if (typeof window !== "undefined") {
      try {
        const localCartRaw = localStorage.getItem("cart");
        localCart = localCartRaw ? JSON.parse(localCartRaw) : null;
      } catch {
        localCart = null;
      }
    }
    setCart(cartProp ?? cartFromState ?? localCart ?? []);
  }, [cartProp, cartFromState]);

  // Update localStorage when cart changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, it) => sum + (it.product?.price ?? 0) * (it.quantity ?? 0),
        0
      ),
    [cart]
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

  // Remove item from cart
  const handleRemoveItem = (id: string | number) => {
    const updated = cart.filter((it) => it.product.id !== id);
    setCart(updated);
  };

  // Update quantity
  const handleQuantityChange = (id: string | number, qty: number) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((it) => (it.product.id === id ? { ...it, quantity: qty } : it))
    );
  };

  const handlePlaceOrder = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!name || !email || !address || !city || !postal || !country) {
      setError("Please fill all shipping fields.");
      return;
    }
    // Demo: Validate payment fields
    if (!cardNumber || !expiry || !cvc) {
      setError("Please fill all payment fields.");
      return;
    }

    const order = {
      items: cart,
      shipping: { name, email, address, city, postal, country },
      total: subtotal,
    };

    setProcessing(true);

    try {
      if (onPlaceOrder) {
        await Promise.resolve(onPlaceOrder(order));
      }
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("cart");
        } catch {
          // Ignore localStorage errors
        }
      }
      setCart([]);
      navigate("/order-success", { state: { order } });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to place order.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      <TopBanner />

      <main className='max-w-7xl mx-auto py-8 px-4'>
        <h1 className='text-2xl font-bold mb-6'>Checkout</h1>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Shipping form */}
          <form
            className='md:col-span-2 bg-card rounded-lg p-6 shadow-sm'
            onSubmit={handlePlaceOrder}
            autoComplete='off'
          >
            <h2 className='text-lg font-medium mb-4'>Shipping details</h2>

            {error && <div className='mb-4 text-sm text-red-600'>{error}</div>}

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <input
                className='border rounded px-3 py-2'
                placeholder='Full name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete='name'
              />
              <input
                className='border rounded px-3 py-2'
                placeholder='Email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete='email'
              />
              <input
                className='col-span-1 sm:col-span-2 border rounded px-3 py-2'
                placeholder='Address'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                autoComplete='street-address'
              />
              <input
                className='border rounded px-3 py-2'
                placeholder='City'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                autoComplete='address-level2'
              />
              <input
                className='border rounded px-3 py-2'
                placeholder='Postal code'
                value={postal}
                onChange={(e) => setPostal(e.target.value)}
                required
                autoComplete='postal-code'
              />
              <input
                className='border rounded px-3 py-2'
                placeholder='Country'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                autoComplete='country'
              />
            </div>

            <div className='mt-6'>
              <h3 className='font-medium mb-2'>Payment</h3>
              <p className='text-sm text-muted-foreground mb-3'>
                This demo does not process payments. Add payment integration
                where indicated.
              </p>

              <div className='space-y-3'>
                <input
                  className='border rounded px-3 py-2 w-full'
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
                    className='border rounded px-3 py-2'
                    placeholder='MM/YY'
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    maxLength={5}
                    inputMode='numeric'
                    autoComplete='cc-exp'
                    required
                  />
                  <input
                    className='border rounded px-3 py-2'
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
                disabled={processing || cart.length === 0}
                className={`px-4 py-2 rounded text-white ${
                  processing || cart.length === 0
                    ? "bg-gray-300 cursor-not-allowed"
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
                className='px-4 py-2 rounded border'
              >
                Return to shop
              </button>
            </div>
          </form>

          {/* Order summary */}
          <aside className='bg-card rounded-lg p-6 shadow-sm'>
            <h2 className='text-lg font-medium mb-4'>Order summary</h2>

            {cart.length === 0 ? (
              <div className='text-sm text-muted-foreground'>
                Your cart is empty.
              </div>
            ) : (
              <div className='space-y-4'>
                {cart.map((it) => (
                  <div key={it.product.id} className='flex items-center gap-3'>
                    <div className='w-14 h-14 bg-muted rounded overflow-hidden flex-shrink-0'>
                      {it.product.image ? (
                        <img
                          src={it.product.image}
                          alt={it.product.name}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center text-xs text-muted-foreground'>
                          img
                        </div>
                      )}
                    </div>

                    <div className='flex-1'>
                      <div className='font-medium text-sm'>
                        {it.product.name}
                      </div>
                      <div className='text-xs text-muted-foreground flex items-center gap-2'>
                        Qty:{" "}
                        <input
                          type='number'
                          min={1}
                          value={it.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              it.product.id,
                              Number(e.target.value)
                            )
                          }
                          className='w-12 border rounded px-1 py-0.5 text-xs'
                        />
                        × ${Number(it.product.price ?? 0).toFixed(2)}
                      </div>
                    </div>

                    <div className='font-medium'>
                      ${((it.product.price ?? 0) * it.quantity).toFixed(2)}
                    </div>
                    <button
                      type='button'
                      aria-label='Remove item'
                      className='ml-2 text-red-500 hover:underline text-xs'
                      onClick={() => handleRemoveItem(it.product.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className='border-t pt-4'>
                  <div className='flex justify-between text-sm'>
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-sm mt-2'>
                    <span>Shipping</span>
                    <span>—</span>
                  </div>
                  <div className='flex justify-between text-lg font-bold mt-4'>
                    <span>Total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
