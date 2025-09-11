import { Product } from "@/types/product";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartProps {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  onClose: () => void;
}

const Cart = ({
  cart,
  removeFromCart,
  updateCartQuantity,
  onClose,
}: CartProps) => {
  const navigate = useNavigate();

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + (item.product.price || 0) * item.quantity,
        0
      ),
    [cart]
  );

  const handleViewCart = () => {
    onClose();
    navigate("/cart", { state: { cart } });
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout", { state: { cart } });
  };

  const handleDecrease = (item: CartItem) => {
    const next = Math.max(1, item.quantity - 1);
    updateCartQuantity(item.product.id, next);
  };

  const handleIncrease = (item: CartItem) => {
    updateCartQuantity(item.product.id, item.quantity + 1);
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
        className='fixed right-0 top-0 w-full max-w-md md:w-96 h-full bg-white shadow-lg z-50 flex flex-col'
        role='dialog'
        aria-label='Shopping cart'
      >
        {/* Header */}
        <header className='flex items-center justify-between p-4 border-b'>
          <h2 className='text-lg font-semibold'>Your Cart ({cart.length})</h2>
          <button
            aria-label='Close cart'
            onClick={onClose}
            className='ml-4 text-gray-600 hover:text-gray-800'
          >
            ×
          </button>
        </header>

        {/* Items */}
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
          {cart.length === 0 ? (
            <div className='text-center text-muted-foreground py-12'>
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
            cart.map((item) => (
              <div
                key={item.product.id}
                className='flex items-center gap-4 border rounded p-3'
              >
                {/* optional small image */}
                {item.product.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className='w-16 h-16 object-cover rounded'
                  />
                ) : (
                  <div className='w-16 h-16 bg-muted rounded flex items-center justify-center text-sm'>
                    img
                  </div>
                )}

                <div className='flex-1'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <div className='font-medium'>{item.product.name}</div>
                      <div className='text-sm text-muted-foreground'>
                        {item.product.category || ""}
                      </div>
                    </div>
                    <div className='font-semibold'>
                      ${(item.product.price || 0).toFixed(2)}
                    </div>
                  </div>

                  <div className='mt-3 flex items-center gap-3'>
                    <div className='flex items-center border rounded'>
                      <button
                        onClick={() => handleDecrease(item)}
                        aria-label={`Decrease quantity for ${item.product.name}`}
                        className='px-2 py-1'
                      >
                        −
                      </button>
                      <div className='px-3'>{item.quantity}</div>
                      <button
                        onClick={() => handleIncrease(item)}
                        aria-label={`Increase quantity for ${item.product.name}`}
                        className='px-2 py-1'
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className='text-sm text-red-600 hover:underline'
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
        <div className='p-4 border-t'>
          <div className='flex items-center justify-between mb-4'>
            <span className='font-medium'>Subtotal</span>
            <span className='text-xl font-bold'>${total.toFixed(2)}</span>
          </div>

          <div className='space-y-2'>
            <button
              onClick={handleViewCart}
              className='w-full py-2 px-4 bg-black text-yellow-500 rounded hover:bg-black/90 transition'
            >
              View Cart
            </button>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`w-full py-2 px-4 rounded text-white transition ${
                cart.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
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
