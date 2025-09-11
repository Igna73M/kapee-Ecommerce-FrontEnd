import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import Cart from "@/components/Cart";
import Header from "@/components/Header";
import Checkout from "./pages/Checkout";
import CartPage from "./pages/CartPage";

import { useState } from "react";
import { Product } from "@/types/product";
import Shop from "./pages/Shop";
import Index from "./pages/Index";
import Wishlist from "./pages/Wishlist";
import WishlistPage from "./pages/Wishlist";
import { products } from "./data/products";

const queryClient = new QueryClient();

const App = () => {
  // Cart state: array of {product, quantity}
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(
    []
  );
  // Wishlist state: array of product ids
  const [wishlist, setWishlist] = useState<string[]>([]);
  // Add/remove product from wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Open cart
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Add product to cart
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  // Remove product from cart
  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  // Update quantity
  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Header cart={cart} wishlist={wishlist} onCartClick={openCart} />
          {/* Cart UI */}
          {isCartOpen && (
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              updateCartQuantity={updateCartQuantity}
              onClose={closeCart}
            />
          )}
          <Routes>
            <Route
              path='/cart'
              element={
                <CartPage
                  cart={cart}
                  removeFromCart={removeFromCart}
                  updateCartQuantity={updateCartQuantity}
                />
              }
            />
            <Route
              path='/'
              element={
                <Index
                  addToCart={addToCart}
                  cart={cart}
                  removeFromCart={removeFromCart}
                  updateCartQuantity={updateCartQuantity}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  openCart={openCart}
                />
              }
            />
            <Route
              path='/shop'
              element={
                <Shop
                  addToCart={addToCart}
                  cart={cart}
                  removeFromCart={removeFromCart}
                  updateCartQuantity={updateCartQuantity}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  openCart={openCart}
                />
              }
            />
            <Route path='/checkout' element={<Checkout cart={cart} />} />
            <Route path='/blog' element={<Blog />} />
            <Route
              path='/wishlist'
              element={
                <WishlistPage
                  wishlist={products.filter((p) => wishlist.includes(p.id))}
                  onProductClick={() => {}}
                  addToCart={addToCart}
                  toggleWishlist={toggleWishlist}
                />
              }
            />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
