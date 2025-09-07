import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

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
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className='fixed right-0 top-0 w-96 h-full bg-white shadow-lg z-50 flex flex-col'>
      <div className='flex justify-between items-center p-4 border-b'>
        <h2 className='text-xl font-bold'>Your Cart</h2>
        <Button variant='ghost' size='icon' onClick={onClose}>
          ×
        </Button>
      </div>
      <div className='flex-1 overflow-y-auto p-4'>
        {cart.length === 0 ? (
          <div className='text-center text-muted-foreground mt-16'>
            Your cart is empty.
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.product.id}
              className='flex items-center gap-4 mb-6 border-b pb-4'
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className='w-16 h-16 object-cover rounded'
              />
              <div className='flex-1'>
                <div className='font-semibold'>{item.product.name}</div>
                <div className='text-sm text-muted-foreground'>
                  ${item.product.price} x {item.quantity}
                </div>
                <div className='flex items-center gap-2 mt-2'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() =>
                      updateCartQuantity(
                        item.product.id,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() =>
                      updateCartQuantity(item.product.id, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                  <Button
                    variant='destructive'
                    size='icon'
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
              <div className='font-bold self-end underline'>
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
      <div className='p-4 border-t flex justify-between items-center'>
        <span className='font-bold'>Total:</span>
        <span className='text-xl font-bold'>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default Cart;
