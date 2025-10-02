import { useState, useEffect } from "react";
import axios from "axios";
import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import CategorySidebar from "@/components/CategorySidebar";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Product } from "@/types/product";
import { Notify } from "notiflix";

interface ShopProps {
  addToCart: (product: Product, quantity?: number) => void;
  cart: { product: Product; quantity: number }[];
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  openCart: () => void;
}

const LOCAL_CART_KEY = "localCart";
const LOCAL_WISHLIST_KEY = "wishlist";

function getLocalCart(): { product: Product; quantity: number }[] {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalCart(cart: { product: Product; quantity: number }[]) {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
}

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

const Shop = ({
  addToCart,
  cart,
  removeFromCart,
  updateCartQuantity,
  wishlist: wishlistProp,
  toggleWishlist: toggleWishlistProp,
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

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(wishlistProp || []);

  // Fetch products
  useEffect(() => {
    axios
      .get(`https://kapee-ecommerce-backend.onrender.com/api_v1/products`)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  // Fetch wishlist from backend or localStorage on mount
  useEffect(() => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      axios
        .get(
          `https://kapee-ecommerce-backend.onrender.com/api_v1/wishlist/me`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        )
        .then((res) => {
          if (Array.isArray(res.data?.wishlist)) {
            setWishlist(res.data.wishlist);
            localStorage.setItem(
              LOCAL_WISHLIST_KEY,
              JSON.stringify(res.data.wishlist)
            );
          } else {
            setWishlist([]);
            localStorage.setItem(LOCAL_WISHLIST_KEY, "[]");
          }
        })
        .catch(() => {
          setWishlist([]);
        });
    } else {
      // Not logged in: use localStorage
      try {
        const localWishlist = JSON.parse(
          localStorage.getItem(LOCAL_WISHLIST_KEY) || "[]"
        );
        setWishlist(Array.isArray(localWishlist) ? localWishlist : []);
      } catch {
        setWishlist([]);
      }
    }
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Add to cart handler (localStorage + backend)
  const handleAddToCart = async (product: Product, quantity: number = 1) => {
    const localCart = getLocalCart();
    const idx = localCart.findIndex((item) => item.product._id === product._id);
    if (idx > -1) {
      localCart[idx].quantity += quantity;
    } else {
      localCart.push({ product, quantity });
    }
    setLocalCart(localCart);

    const token = getCookie("accessToken");
    if (token) {
      try {
        await axios.post(
          `https://kapee-ecommerce-backend.onrender.com/api_v1/carts/add`,
          { productId: product._id, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        // Optionally show error feedback
        console.error("Failed to sync cart with server:", err);
        Notify.failure("Failed to sync cart with server");
      }
    }

    if (addToCart) addToCart(product, quantity);
    openCart();
  };

  // Wishlist handler (syncs with backend and localStorage)
  const handleToggleWishlist = async (productId: string) => {
    const accessToken = getCookie("accessToken");
    let updatedWishlist: string[] = [];
    if (wishlist.includes(productId)) {
      // Remove from wishlist
      if (accessToken) {
        try {
          await axios.delete(
            `https://kapee-ecommerce-backend.onrender.com/api_v1/wishlist/remove/${productId}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
              withCredentials: true,
            }
          );
          Notify.success("Removed from wishlist");
        } catch (err) {
          console.error("Failed to remove from wishlist:", err);
          Notify.failure("Failed to remove from wishlist");
        }
      }
      updatedWishlist = wishlist.filter((id) => id !== productId);
    } else {
      // Add to wishlist
      if (accessToken) {
        try {
          await axios.post(
            `https://kapee-ecommerce-backend.onrender.com/api_v1/wishlist/add`,
            { productId },
            {
              headers: { Authorization: `Bearer ${accessToken}` },
              withCredentials: true,
            }
          );
          Notify.success("Added to wishlist");
        } catch (err) {
          console.error("Failed to add to wishlist:", err);
          Notify.failure("Failed to add to wishlist");
        }
      }
      updatedWishlist = [...wishlist, productId];
    }
    setWishlist(updatedWishlist);
    localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(updatedWishlist));
    // Optionally call parent handler
    if (toggleWishlistProp) toggleWishlistProp(productId);
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
              {loading ? (
                <div className='col-span-3 flex items-center justify-center min-h-[200px]'>
                  <span>Loading products...</span>
                </div>
              ) : (
                products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onProductClick={handleProductClick}
                    addToCart={handleAddToCart}
                    wishlist={wishlist}
                    toggleWishlist={handleToggleWishlist}
                  />
                ))
              )}
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
        addToCart={handleAddToCart}
      />
    </div>
  );
};

export default Shop;
