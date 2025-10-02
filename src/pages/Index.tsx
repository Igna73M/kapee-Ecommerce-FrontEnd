import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopBanner from "@/components/TopBanner";
import HeroSection from "@/components/HeroSection";
import BannerSection from "@/components/BannerSection";
import HotDealCard from "@/components/HotDealCard";
import FeaturedHotDeal from "@/components/FeaturedHotDeal";
import ProductModal from "@/components/ProductModal";
import BestSellingSection from "@/components/BestSellingSection";
import ServicesSection from "@/components/ServicesSection";
import BrandsSection from "@/components/BrandsSection";
import ProductTabs from "@/components/ProductTabs";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Product } from "@/types/product";

import Login from "@/components/Login";

interface IndexProps {
  addToCart: (product: Product, quantity?: number) => void;
  cart: { product: Product; quantity: number }[];
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  openCart: () => void;
}

const Index = ({
  addToCart,
  cart,
  removeFromCart,
  updateCartQuantity,
  wishlist,
  toggleWishlist,
  openCart,
}: IndexProps) => {
  useEffect(() => {
    const darkMode = localStorage.getItem("dashboardDarkMode") === "true";
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login status using token or cookies
    const token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");
    const cookies = document.cookie;
    const hasUserRole = cookies.includes("userRole=");
    const hasUsername = cookies.includes("username=");
    const loggedIn = !!token || !hasUserRole || !hasUsername;
    setIsLoggedIn(loggedIn);
    setShowLogin(!loggedIn);
  }, []);

  useEffect(() => {
    // Always sync localCart with backend on render
    const syncLocalCartWithBackend = async () => {
      const localCartRaw = localStorage.getItem("localCart");
      let localCart: { product: Product; quantity: number }[] = [];
      try {
        localCart = localCartRaw ? JSON.parse(localCartRaw) : [];
      } catch {
        localCart = [];
      }
      const token =
        localStorage.getItem("token") || localStorage.getItem("accessToken");
      if (localCart.length > 0 && token) {
        try {
          await axios.post(
            `https://kapee-ecommerce-backend.onrender.com/api_v1/carts/add`,
            {
              items: localCart.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
              })),
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          localStorage.removeItem("localCart");
        } catch (err) {
          // Optionally handle sync error
        }
      }
    };

    syncLocalCartWithBackend();

    axios
      .get(`https://kapee-ecommerce-backend.onrender.com/api_v1/products`)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Show first 6 products as "Hot Deals"
  const hotDeals = products.slice(0, 6);

  // Show login modal if not logged in

  return (
    <div className='min-h-screen bg-background dark:bg-gray-900'>
      <TopBanner />
      {showLogin && <Login open={true} onClose={() => setShowLogin(false)} />}

      <main className='max-w-7xl mx-auto py-8 px-4'>
        <div className='grid lg:grid-cols-4 gap-8'>
          {/* Sidebar */}
          <div className='lg:col-span-1'>{/* <CategorySidebar /> */}</div>

          {/* Main Content */}
          <div className='lg:col-span-3 space-y-8'>
            {/* Hero Section */}
            <HeroSection addToCart={addToCart} openCart={openCart} />

            {/* Banner Section */}
            <BannerSection addToCart={addToCart} openCart={openCart} />

            {/* Hot Deals Section */}
            <section>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-foreground dark:text-yellow-100 border-b-2 border-yellow-400 pb-2'>
                  HOT DEALS
                </h2>
                <div className='flex items-center gap-4'>
                  <h3 className='text-xl font-bold text-foreground dark:text-yellow-100 border-b-2 border-yellow-400 pb-2'>
                    FEATURED PRODUCTS
                  </h3>
                  <button
                    className='bg-muted dark:bg-gray-800 text-muted-foreground dark:text-yellow-100 px-4 py-2 rounded text-sm font-medium hover:bg-muted/80 dark:hover:bg-gray-700'
                    onClick={() => navigate("/shop")}
                  >
                    VIEW ALL
                  </button>
                </div>
              </div>
              <div className='grid lg:grid-cols-2 gap-6'>
                {/* Featured Hot Deal - Left Side */}
                <div>
                  <FeaturedHotDeal
                    onProductClick={handleProductClick}
                    addToCart={addToCart}
                  />
                </div>

                {/* Regular Hot Deals - Right Side */}
                <div className='grid grid-cols-2 gap-4'>
                  {hotDeals.slice(1, 5).map((product) => (
                    <HotDealCard
                      key={product._id}
                      product={product}
                      onProductClick={handleProductClick}
                      addToCart={addToCart}
                      wishlist={wishlist}
                      toggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Best Selling Products Section */}
            <BestSellingSection />
          </div>
        </div>

        {/* Services Section */}
        <ServicesSection />

        {/* Product Tabs Section */}
        <ProductTabs onProductClick={handleProductClick} />

        {/* Brands Section */}
        <BrandsSection />
      </main>

      <Footer />
      <ScrollToTop />

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
        addToCart={addToCart}
        openCart={openCart}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
      />
    </div>
  );
};
export default Index;
