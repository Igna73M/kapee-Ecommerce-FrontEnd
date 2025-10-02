import { useEffect, useState } from "react";
import ProductCard from "../../../components/ProductCard";
import { Product } from "../../../types/product";
import axios from "axios";
import Notiflix from "notiflix";

type WishlistPageProps = {
  onProductClick: (product: Product) => void;
  addToCart?: (product: Product, quantity?: number) => void;
};

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function WishlistPage({ onProductClick, addToCart }: WishlistPageProps) {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist products from backend
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      const accessToken = getCookie("accessToken");
      if (accessToken) {
        try {
          const res = await axios.get(
            `https://kapee-ecommerce-backend.onrender.com/api_v1/wishlist/me`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
              withCredentials: true,
            }
          );
          // The response is { ... , items: [{product: {...}, ...}, ...] }
          if (Array.isArray(res.data?.items)) {
            const products: Product[] = res.data.items
              .map((item) => item.product)
              .filter((p: Product) => !!p && !!p._id);
            setWishlistProducts(products);
            setWishlistIds(products.map((p) => p._id));
          } else {
            setWishlistProducts([]);
            setWishlistIds([]);
          }
        } catch (err) {
          setWishlistProducts([]);
          setWishlistIds([]);
          Notiflix.Notify.failure("Failed to load wishlist.");
        }
      } else {
        setWishlistProducts([]);
        setWishlistIds([]);
      }
      setLoading(false);
    };
    fetchWishlist();

    // Set dark mode
    const darkMode = localStorage.getItem("dashboardDarkMode") === "true";
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  // Toggle wishlist handler (sync with backend)
  const handleToggleWishlist = async (productId: string) => {
    const accessToken = getCookie("accessToken");
    if (!accessToken) {
      Notiflix.Notify.info("Please login to use wishlist.");
      return;
    }
    let updatedProducts: Product[] = [];
    let updatedIds: string[] = [];
    if (wishlistIds.includes(productId)) {
      // Remove from wishlist
      try {
        await axios.delete(
          `https://kapee-ecommerce-backend.onrender.com/api_v1/wishlist/remove/${productId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );
        updatedProducts = wishlistProducts.filter((p) => p._id !== productId);
        updatedIds = updatedProducts.map((p) => p._id);
        Notiflix.Notify.success("Removed from wishlist");
      } catch (err) {
        Notiflix.Notify.failure("Failed to remove from wishlist");
        return;
      }
    } else {
      // Add to wishlist
      try {
        const res = await axios.post(
          `https://kapee-ecommerce-backend.onrender.com/api_v1/wishlist/add`,
          { productId },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );
        // Fallback: refetch wishlist for consistency
        const refetch = await axios.get(
          "https://kapee-ecommerce-backend.onrender.com/api_v1/wishlist/me",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );
        if (Array.isArray(refetch.data?.items)) {
          const products: Product[] = refetch.data.items
            .map((item) => item.product)
            .filter((p: Product) => !!p && !!p._id);
          updatedProducts = products;
          updatedIds = products.map((p) => p._id);
        }
        Notiflix.Notify.success("Added to wishlist");
      } catch (err) {
        Notiflix.Notify.failure("Failed to add to wishlist");
        return;
      }
    }
    setWishlistProducts(updatedProducts);
    setWishlistIds(updatedIds);
  };

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 bg-background dark:bg-gray-900 min-h-screen'>
      <h1 className='text-2xl font-bold mb-6 text-gray-900 dark:text-yellow-100'>
        My Wishlist
      </h1>
      {loading ? (
        <div className='text-center text-muted-foreground dark:text-yellow-100 py-16'>
          Loading wishlist...
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className='text-center text-muted-foreground dark:text-yellow-100 py-16'>
          Your wishlist is empty.
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {wishlistProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onProductClick={onProductClick}
              addToCart={addToCart}
              wishlist={wishlistIds}
              toggleWishlist={handleToggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
