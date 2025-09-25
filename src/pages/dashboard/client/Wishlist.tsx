import { useEffect } from "react";
import ProductCard from "../../../components/ProductCard";
import { Product } from "../../../types/product";

type WishlistPageProps = {
  wishlist: Product[];
  onProductClick: (product: Product) => void;
  addToCart?: (product: Product, quantity?: number) => void;
  toggleWishlist?: (productId: string) => void;
};

function WishlistPage({
  wishlist,
  onProductClick,
  addToCart,
  toggleWishlist,
}: WishlistPageProps) {
  useEffect(() => {
    const darkMode = localStorage.getItem("dashboardDarkMode") === "true";
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 bg-background dark:bg-gray-900 min-h-screen'>
      <h1 className='text-2xl font-bold mb-6 text-gray-900 dark:text-yellow-100'>
        My Wishlist
      </h1>
      {wishlist.length === 0 ? (
        <div className='text-center text-muted-foreground dark:text-yellow-100 py-16'>
          Your wishlist is empty.
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={onProductClick}
              addToCart={addToCart}
              wishlist={wishlist.map((p) => p.id)}
              toggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
