import React from "react";
import ProductCard from "../components/ProductCard";
import { Product } from "../types/product";

interface WishlistPageProps {
  wishlist: Product[];
  onProductClick: (product: Product) => void;
  addToCart?: (product: Product, quantity?: number) => void;
  toggleWishlist?: (productId: string) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({
  wishlist,
  onProductClick,
  addToCart,
  toggleWishlist,
}) => {
  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>My Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className='text-center text-muted-foreground py-16'>
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
};

export default WishlistPage;
