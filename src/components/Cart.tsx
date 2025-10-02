import { Product } from "@/types/product";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartProps {
  cart: CartItem[];
  onClose: () => void;
  removeFromCart?: (productId: string) => void;
  updateCartQuantity?: (productId: string, quantity: number) => void;
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

function setLocalCart(cart: CartItem[]) {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
}

const Cart = ({
  cart,
  removeFromCart,
  updateCartQuantity,
  onClose,
}: CartProps) => {
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [localCart, setLocalCartState] = useState<CartItem[]>(getLocalCart());

  // Sync local cart with backend cart if logged in
  React.useEffect(() => {
    if (cart.length > 0) {
      setLocalCartState(cart);
      setLocalCart(cart);
    }
  }, [cart]);

  // Filter out invalid cart items
  const validLocalCart = localCart.filter(
    (item) => item.product && typeof item.product.price === "number"
  );

  const total = useMemo(
    () =>
      validLocalCart.reduce(
        (sum, item) => sum + (item.product.price || 0) * item.quantity,
        0
      ),
    [validLocalCart]
  );

  // Remove product from cart (local + backend)
  const handleRemove = async (productId: string) => {
    setUpdatingId(productId);
    // Remove from local cart
    const updatedLocalCart = validLocalCart.filter(
      (item) => item.product._id !== productId
    );
    setLocalCartState(updatedLocalCart);
    setLocalCart(updatedLocalCart);

    // Remove from backend if logged in
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.delete(
          `https://kapee-ecommerce-backend.onrender.com/api_v1/carts/remove`,
          {
            data: { productId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (removeFromCart) removeFromCart(productId);
      } catch (err) {
        // Optionally show error feedback
        console.error(err);
      }
    }
    setUpdatingId(null);
  };

  // Update quantity (local + backend)
  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    setUpdatingId(productId);
    // Update local cart
    const updatedLocalCart = validLocalCart.map((item) =>
      item.product._id === productId ? { ...item, quantity } : item
    );
    setLocalCartState(updatedLocalCart);
    setLocalCart(updatedLocalCart);

    // Update backend if logged in
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.patch(
          `https://kapee-ecommerce-backend.onrender.com/api_v1/carts/update`,
          { productId, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (updateCartQuantity) updateCartQuantity(productId, quantity);
      } catch (err) {
        // Optionally show error feedback
        console.error(err);
      }
    }
    setUpdatingId(null);
  };

  const handleViewCart = () => {
    onClose();
    navigate("/cart", { state: { cart: validLocalCart } });
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout", { state: { cart: validLocalCart } });
  };

  const handleDecrease = (item: CartItem) => {
    const next = Math.max(1, item.quantity - 1);
    handleUpdateQuantity(item.product._id, next);
  };

  const handleIncrease = (item: CartItem) => {
    handleUpdateQuantity(item.product._id, item.quantity + 1);
  };

  return (
    <>
      {/* backdrop */}
      <div
        className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40'
        onClick={onClose}
        aria-label='Close cart overlay'
      />

      {/* Cart Panel */}
      <aside
        className='fixed right-0 top-0 w-full max-w-md md:w-96 h-full bg-white dark:bg-gray-900 shadow-lg z-50 flex flex-col'
        role='dialog'
        aria-label='Shopping cart'
      >
        {/* Header */}
        <header className='flex items-center justify-between p-4 border-b dark:border-gray-700'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-yellow-100'>
            Your Cart ({validLocalCart.length})
          </h2>
          <button
            aria-label='Close cart'
            onClick={onClose}
            className='ml-4 text-gray-600 dark:text-yellow-100 hover:text-gray-800 dark:hover:text-yellow-300'
          >
            ×
          </button>
        </header>

        {/* Items */}
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
          {validLocalCart.length === 0 ? (
            <div className='text-center text-muted-foreground dark:text-yellow-100 py-12'>
              Your cart is empty.
              <div className='mt-4'>
                <button
                  onClick={() => {
                    onClose();
                    navigate("/shop");
                  }}
                  className='inline-flex items-center px-4 py-2 bg-primary text-white rounded'
                >
                  Continue shopping
                </button>
              </div>
            </div>
          ) : (
            validLocalCart.map((item) => (
              <div
                key={item.product._id}
                className='flex items-center gap-4 border dark:border-gray-700 rounded p-3 bg-white dark:bg-gray-800'
              >
                {/* optional small image */}
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
                        onClick={() => handleDecrease(item)}
                        aria-label={`Decrease quantity for ${item.product.name}`}
                        className='px-2 py-1 text-gray-900 dark:text-yellow-100'
                        disabled={updatingId === item.product._id}
                      >
                        −
                      </button>
                      <div className='px-3 text-gray-900 dark:text-yellow-100'>
                        {item.quantity}
                      </div>
                      <button
                        onClick={() => handleIncrease(item)}
                        aria-label={`Increase quantity for ${item.product.name}`}
                        className='px-2 py-1 text-gray-900 dark:text-yellow-100'
                        disabled={updatingId === item.product._id}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className='text-sm text-red-600 dark:text-red-400 hover:underline'
                      disabled={updatingId === item.product._id}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className='p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-900'>
          <div className='flex items-center justify-between mb-4'>
            <span className='font-medium text-gray-900 dark:text-yellow-100'>
              Subtotal
            </span>
            <span className='text-xl font-bold text-gray-900 dark:text-yellow-100'>
              ${total.toFixed(2)}
            </span>
          </div>

          <div className='space-y-2'>
            <button
              onClick={handleViewCart}
              className='w-full py-2 px-4 bg-black dark:bg-gray-800 text-yellow-500 dark:text-yellow-400 rounded hover:bg-black/90 dark:hover:bg-gray-700 transition'
            >
              View Cart
            </button>

            <button
              onClick={handleCheckout}
              disabled={validLocalCart.length === 0}
              className={`w-full py-2 px-4 rounded text-white transition ${
                validLocalCart.length === 0
                  ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                  : "bg-[tomato] hover:bg-[tomato]"
              }`}
            >
              Checkout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Cart;
