import { useState, useEffect } from "react";
import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import CategorySidebar from "@/components/CategorySidebar";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { products } from "@/data/products";
import { Product } from "@/types/product";

interface ShopProps {
  addToCart: (product: Product, quantity?: number) => void;
  cart: { product: Product; quantity: number }[];
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  openCart: () => void;
}

const Shop = ({
  addToCart,
  cart,
  removeFromCart,
  updateCartQuantity,
  wishlist,
  toggleWishlist,
  openCart,
}: ShopProps) => {
  useEffect(() => {
    const darkMode = localStorage.getItem("dashboardDarkMode") === "true";
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className='min-h-screen bg-background dark:bg-gray-900'>
      <TopBanner />
      {/* <Header cart={cart} /> */}

      <main className='max-w-7xl mx-auto py-8 px-4'>
        <div className='grid lg:grid-cols-4 gap-8'>
          {/* Sidebar */}
          <div className='lg:col-span-1'>
            <CategorySidebar open={false} onClose={() => {}} />
          </div>

          {/* Products Grid */}
          <div className='lg:col-span-3'>
            <div className='mb-6'>
              <h1 className='text-3xl font-bold mb-2 text-gray-900 dark:text-yellow-100'>
                Shop Electronics
              </h1>
              <p className='text-muted-foreground dark:text-yellow-100'>
                Discover our amazing collection of electronics
              </p>
              <button
                className='bg-muted dark:bg-gray-800 text-muted-foreground dark:text-yellow-100 px-4 py-2 rounded text-sm font-medium hover:bg-muted/80 dark:hover:bg-gray-700 mt-2'
                onClick={() => {
                  const grid = document.getElementById("products-grid");
                  if (grid) grid.scrollIntoView({ behavior: "smooth" });
                }}
              >
                VIEW ALL
              </button>
            </div>

            <div
              id='products-grid'
              className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'
            >
              {products.map((product) => (
                <ProductCard
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
        </div>
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
      />
    </div>
  );
};

export default Shop;
