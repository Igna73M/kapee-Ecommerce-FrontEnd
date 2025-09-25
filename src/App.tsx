import DashBrand from "./pages/dashboard/DashBrand";
import DashServices from "./pages/dashboard/DashServices";
import DashAdvert from "./pages/dashboard/DashAdvert";
import DashBanner from "./pages/dashboard/DashBanner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

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
import Wishlist from "./pages/dashboard/client/Wishlist";
import WishlistPage from "./pages/dashboard/client/Wishlist";
import { products } from "./data/products";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import DashProduct from "./pages/dashboard/DashProduct";
import DashCustomers from "./pages/dashboard/DashCustomers";
import DashProfile from "./pages/dashboard/DashProfile";
import DashSettings from "./pages/dashboard/DashSettings";
import DashBlog from "./pages/dashboard/DashBlog";
import BlogPost from "./pages/BlogPost";
import ClientDashboard from "./pages/dashboard/client/ClientDashboard";
import ClientDashboardLayout from "./pages/dashboard/client/ClientDashboardLayout";
import ClientProfile from "./pages/dashboard/client/ClientDashProfile";
import ClientSettings from "./pages/dashboard/client/ClientDashSettings";
import ClientOrders from "./pages/dashboard/client/ClientOrders";
import ClientSupport from "./pages/dashboard/client/ClientSupport";

const queryClient = new QueryClient();

const App = () => {
  // Get current location for conditional header rendering
  const location =
    typeof window !== "undefined" ? window.location : { pathname: "/" };
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
      <BrowserRouter>
        <Header cart={cart} wishlist={wishlist} onCartClick={openCart} />
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
          <Route path='/blog/:id' element={<BlogPost />} />

          <Route path='/dashboard' element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='/dashboard/product' element={<DashProduct />} />
            <Route path='/dashboard/customers' element={<DashCustomers />} />
            <Route path='/dashboard/profile' element={<DashProfile />} />
            <Route path='/dashboard/settings' element={<DashSettings />} />
            <Route path='/dashboard/brands' element={<DashBrand />} />
            <Route path='/dashboard/services' element={<DashServices />} />
            <Route path='/dashboard/advertisement' element={<DashAdvert />} />
            <Route path='/dashboard/banners' element={<DashBanner />} />
            <Route path='/dashboard/blog' element={<DashBlog />} />
          </Route>
          {/* Client Dashboard */}
          <Route path='/client-dashboard' element={<ClientDashboardLayout />}>
            <Route index element={<ClientDashboard />} />
            <Route
              path='/client-dashboard/profile'
              element={<ClientProfile />}
            />
            <Route
              path='/client-dashboard/settings'
              element={<ClientSettings />}
            />
            <Route path='/client-dashboard/orders' element={<ClientOrders />} />
            <Route
              path='/client-dashboard/support'
              element={<ClientSupport />}
            />
            <Route
              path='/client-dashboard/wishlist'
              element={
                <WishlistPage
                  wishlist={products.filter((p) => wishlist.includes(p.id))}
                  onProductClick={() => {}}
                  addToCart={(product, quantity) => {
                    addToCart(product, quantity);
                    openCart();
                  }}
                  toggleWishlist={toggleWishlist}
                />
              }
            />
          </Route>
          {/* 404 Page error */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
