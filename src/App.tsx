import DashBrand from "./pages/dashboard/DashBrand";
import DashServices from "./pages/dashboard/DashServices";
import DashAdvert from "./pages/dashboard/DashAdvert";
import DashBanner from "./pages/dashboard/DashBanner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import Cart from "@/components/Cart";
import Header from "@/components/Header";
import Checkout from "./pages/Checkout";
import CartPage from "./pages/CartPage";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Product } from "@/types/product";
import Shop from "./pages/Shop";
import Index from "./pages/Index";
import WishlistPage from "./pages/dashboard/client/Wishlist";
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
import Login from "@/components/Login"; // Make sure you have a Login component
import OrderSuccess from "./pages/OrderSuccess";
import DashMessage from "./pages/dashboard/DashMessage";

const queryClient = new QueryClient();

// Helper to get cookie value
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

// Route guard for dashboard/admin/client-dashboard
function ProtectedRoute({
  children,
  type,
}: {
  children: JSX.Element;
  type: "admin" | "user";
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const userRole = getCookie("userRole");
    const isLoggedIn = !!getCookie("token") || !!getCookie("accessToken");

    // For admin dashboard
    if (type === "admin") {
      if (!isLoggedIn || userRole !== "admin") {
        setShowLogin(true);
        window.location.replace("http://localhost:8080/");
      }
    }
    // For client dashboard
    if (type === "user") {
      if (!isLoggedIn || userRole !== "user") {
        setShowLogin(true);
        window.location.replace("http://localhost:8080/");
      }
    }
  }, [location.pathname, type]);

  return (
    <>
      {showLogin && <Login open={true} onClose={() => setShowLogin(false)} />}
      {!showLogin && children}
    </>
  );
}

const App = () => {
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(
    []
  );
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  // Fetch products from backend
  useEffect(() => {
    axios
      .get(`https://kapee-ecommerce-backend.onrender.com/api_v1/products`)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  // Helper to refresh cart from backend
  const refreshCart = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    axios
      .get(`https://kapee-ecommerce-backend.onrender.com/api_v1/carts`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCart(res.data.items || []))
      .catch(() => setCart([]));
  }, []);

  // Initial cart fetch
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Wishlist logic
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Add product to cart via backend
  const addToCart = async (product: Product, quantity: number = 1) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        `https://kapee-ecommerce-backend.onrender.com/api_v1/carts/add`,
        { productId: product._id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refreshCart();
    } catch (err) {
      // Optionally show error feedback
      console.error(err);
    }
  };

  // Remove product from cart via backend
  const removeFromCart = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.delete(
        `https://kapee-ecommerce-backend.onrender.com/api_v1/carts/remove`,
        {
          data: { productId },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      refreshCart();
    } catch (err) {
      // Optionally show error feedback
      console.error(err);
    }
  };

  // Update quantity via backend
  const updateCartQuantity = async (productId: string, quantity: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.patch(
        `https://kapee-ecommerce-backend.onrender.com/api_v1/carts/update`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      refreshCart();
    } catch (err) {
      // Optionally show error feedback
      console.error(err);
    }
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
        {showLogin && <Login open={true} onClose={() => setShowLogin(false)} />}
        <Routes>
          <Route path='/cart' element={<CartPage />} />
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
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/blog/:id' element={<BlogPost />} />

          {/* Admin Dashboard */}
          <Route
            path='/dashboard/*'
            element={
              <ProtectedRoute type='admin'>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path='product' element={<DashProduct />} />
            <Route path='customers' element={<DashCustomers />} />
            <Route path='profile' element={<DashProfile />} />
            <Route path='settings' element={<DashSettings />} />
            <Route path='brands' element={<DashBrand />} />
            <Route path='services' element={<DashServices />} />
            <Route path='advertisement' element={<DashAdvert />} />
            <Route path='banners' element={<DashBanner />} />
            <Route path='blog' element={<DashBlog />} />
            <Route path='messages' element={<DashMessage />} />
          </Route>
          {/* Client Dashboard */}
          <Route
            path='/client-dashboard/*'
            element={
              <ProtectedRoute type='user'>
                <ClientDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ClientDashboard />} />
            <Route path='profile' element={<ClientProfile />} />
            <Route path='settings' element={<ClientSettings />} />
            <Route path='orders' element={<ClientOrders />} />
            <Route path='support' element={<ClientSupport />} />
            <Route
              path='wishlist'
              element={
                <WishlistPage onProductClick={() => {}} addToCart={addToCart} />
              }
            />
          </Route>
          <Route path='/order-success' element={<OrderSuccess />} />
          {/* 404 Page error */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
