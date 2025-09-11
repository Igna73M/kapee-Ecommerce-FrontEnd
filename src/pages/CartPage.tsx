import React from "react";
import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Product } from "@/types/product";
import { useNavigate, useLocation } from "react-router-dom";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartPageProps {
  cart: CartItem[];
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
}

const CartPage: React.FC<CartPageProps> = ({
  cart,
  removeFromCart,
  updateCartQuantity,
}) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product.price || 0) * item.quantity,
    0
  );

  return (
    <div className='min-h-screen bg-background'>
      <TopBanner />
      <main className='max-w-7xl mx-auto py-8 px-4'>
        <h1 className='text-2xl font-bold mb-6'>Your Cart</h1>
        {cart.length === 0 ? (
          <div className='text-center text-muted-foreground py-12'>
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
            {cart.map((item) => (
              <div
                key={item.product.id}
                className='flex items-center gap-4 border rounded p-3'
              >
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
                        onClick={() =>
                          updateCartQuantity(
                            item.product.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className='px-2 py-1'
                      >
                        −
                      </button>
                      <div className='px-3'>{item.quantity}</div>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.quantity + 1)
                        }
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
            ))}
            <div className='flex justify-between items-center border-t pt-4'>
              <span className='font-medium'>Subtotal</span>
              <span className='text-xl font-bold'>${subtotal.toFixed(2)}</span>
            </div>
            <div className='flex justify-end'>
              <button
                onClick={() => navigate("/checkout", { state: { cart } })}
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
