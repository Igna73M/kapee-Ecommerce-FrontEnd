import { X, Heart, Minus, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  addToCart?: (product: Product, quantity?: number) => void;
  openCart?: () => void;
  wishlist?: string[];
  toggleWishlist?: (productId: string) => void;
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
  const { toast } = useToast();

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Product Image */}
          <div className='relative'>
            {product.discount && (
              <Badge className='absolute top-4 left-4 z-10 bg-green-600 text-white'>
                {product.discount}% Off
              </Badge>
            )}

            <div className='aspect-square overflow-hidden rounded-lg'>
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
              <div className='text-sm text-muted-foreground mb-2'>
                {product.category}
              </div>
              <h1 className='text-3xl font-bold mb-4'>{product.name}</h1>

              {product.rating && (
                <div className='flex items-center gap-2 mb-4'>
                  <div className='flex items-center gap-1'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating!)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className='text-sm text-muted-foreground'>
                    ({product.rating}) Rating
                  </span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className='flex items-center gap-3'>
              <span className='text-3xl font-bold text-primary'>
                ${product.price}.00
              </span>
              {product.originalPrice && (
                <span className='text-lg text-muted-foreground line-through'>
                  ${product.originalPrice}.00
                </span>
              )}
              {product.discount && (
                <Badge variant='destructive'>Save {product.discount}%</Badge>
              )}
            </div>

            {/* Description */}
            <p className='text-muted-foreground'>{product.description}</p>

            {/* Features */}
            {product.features && (
              <div>
                <h3 className='font-semibold mb-3'>Key Features:</h3>
                <ul className='space-y-2'>
                  {product.features.map((feature, index) => (
                    <li key={index} className='flex items-center text-sm'>
                      <span className='w-2 h-2 bg-primary rounded-full mr-3'></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector */}
            <div className='flex items-center gap-4'>
              <span className='font-medium'>Quantity:</span>
              <div className='flex items-center border rounded-lg'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className='h-10 w-10'
                >
                  <Minus className='h-4 w-4' />
                </Button>
                <span className='px-4 py-2 min-w-12 text-center'>
                  {quantity}
                </span>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setQuantity(quantity + 1)}
                  className='h-10 w-10'
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4'>
              <Button
                variant='shop'
                size='lg'
                className='flex-1'
                onClick={() => {
                  if (addToCart && product) {
                    addToCart(product, quantity);
                    onClose();
                    if (openCart) openCart();
                  }
                }}
                disabled={!addToCart}
              >
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>
              <Button
                variant={wishlist.includes(product.id) ? "default" : "outline"}
                size='lg'
                onClick={() => {
                  if (toggleWishlist && product) {
                    toggleWishlist(product.id);
                    toast({
                      title: wishlist.includes(product.id)
                        ? "Removed from Wishlist"
                        : "Added to Wishlist",
                      description: `${product.name} has been ${
                        wishlist.includes(product.id)
                          ? "removed from"
                          : "added to"
                      } your wishlist!`,
                    });
                  }
                }}
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${
                    wishlist.includes(product.id)
                      ? "text-red-500 fill-red-500"
                      : ""
                  }`}
                />
                {wishlist.includes(product.id) ? "Wishlisted" : "Wishlist"}
              </Button>
            </div>

            {/* Stock Status */}
            <div className='flex items-center gap-2'>
              <div
                className={`w-3 h-3 rounded-full ${
                  product.inStock ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className='text-sm'>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
