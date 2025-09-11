import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import CategorySidebar from "@/components/CategorySidebar";
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
import { products } from "@/data/products";
import { Product } from "@/types/product";

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div className='min-h-screen bg-background'>
      <TopBanner />

      <main className='max-w-7xl mx-auto py-8 px-4'>
        <div className='grid lg:grid-cols-4 gap-8'>
          {/* Sidebar */}
          <div className='lg:col-span-1'>{/* <CategorySidebar /> */}</div>

          {/* Main Content */}
          <div className='lg:col-span-3 space-y-8'>
            {/* Hero Section */}
            <HeroSection />

            {/* Banner Section */}
            <BannerSection />

            {/* Hot Deals Section */}
            <section>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-foreground border-b-2 border-yellow-400 pb-2'>
                  HOT DEALS
                </h2>
                <div className='flex items-center gap-4'>
                  <h3 className='text-xl font-bold text-foreground border-b-2 border-yellow-400 pb-2'>
                    FEATURED PRODUCTS
                  </h3>
                  <button
                    className='bg-muted text-muted-foreground px-4 py-2 rounded text-sm font-medium hover:bg-muted/80'
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
                    product={hotDeals[0]}
                    onProductClick={handleProductClick}
                    addToCart={(product, quantity) => {
                      addToCart(product, quantity);
                      openCart();
                    }}
                  />
                </div>

                {/* Regular Hot Deals - Right Side */}
                <div className='grid grid-cols-2 gap-4'>
                  {hotDeals.slice(1, 5).map((product) => (
                    <HotDealCard
                      key={product.id}
                      product={product}
                      onProductClick={handleProductClick}
                      addToCart={(p, q) => {
                        addToCart(p, q);
                        openCart();
                      }}
                      wishlist={wishlist}
                      toggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Best Selling Products Section */}
            <BestSellingSection
              onProductClick={handleProductClick}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
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
        addToCart={(product, quantity) => {
          addToCart(product, quantity);
          openCart();
        }}
        openCart={openCart}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
      />
    </div>
  );
};

export default Index;
