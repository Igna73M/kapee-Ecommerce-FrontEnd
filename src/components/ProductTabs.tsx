import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  features?: string[];
  rating?: number;
  inStock?: boolean;
}

interface BrandCategory {
  _id: string;
  name: string;
}

interface ProductTabsProps {
  onProductClick: (product: Product) => void;
  wishlist?: string[];
  toggleWishlist?: (productId: string) => void;
}

const LOCAL_CART_KEY = "localCart";

interface LocalCartItem {
  productId: string;
  name: string;
  quantity: number;
}

function getLocalCart(): LocalCartItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr)
      ? arr.filter((item) => item.productId && item.name)
      : [];
  } catch {
    return [];
  }
}

function setLocalCart(cart: LocalCartItem[]) {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
}

const ProductTabs = ({
  onProductClick,
  wishlist = [],
  toggleWishlist,
}: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("FEATURED");
  const [showAll, setShowAll] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [brandCategories, setBrandCategories] = useState<BrandCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const [wishlistUpdatingId, setWishlistUpdatingId] = useState<string | null>(
    null
  );

  useEffect(() => {
    Promise.all([
      axios.get(`https://kapee-ecommerce-backend.onrender.com/api_v1/products`),
      axios.get(
        `https://kapee-ecommerce-backend.onrender.com/api_v1/brand-categories`
      ),
    ])
      .then(([prodRes, catRes]) => {
        setProducts(prodRes.data);
        setBrandCategories(catRes.data);
      })
      .catch(() => {
        setProducts([]);
        setBrandCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getCategoryName = (categoryId: string) => {
    const cat = brandCategories.find((c) => c._id === categoryId);
    return cat ? cat.name : categoryId;
  };

  // Add to cart handler (localStorage + backend)
  const handleAddToCart = async (product: Product) => {
    setAddingToCartId(product._id);

    // Local cart update (store productId, name, quantity)
    const localCart = getLocalCart();
    const idx = localCart.findIndex((item) => item.productId === product._id);
    if (idx > -1) {
      localCart[idx].quantity += 1;
    } else {
      localCart.push({
        productId: product._id,
        name: product.name,
        quantity: 1,
      });
    }
    setLocalCart(localCart);

    // Backend cart update if logged in
    function getCookie(name: string): string | null {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()!.split(";").shift() || null;
      return null;
    }

    const accessToken = getCookie("accessToken");
    if (accessToken) {
      try {
        await axios.post(
          `https://kapee-ecommerce-backend.onrender.com/api_v1/carts/add`,
          { productId: product._id, quantity: 1 },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      } catch (err) {
        // Optionally show error feedback
        console.error("Failed to add to cart on server:", err);
      }
    }

    setAddingToCartId(null);
  };

  // Wishlist handler (per product)
  const handleToggleWishlist = async (productId: string) => {
    if (!toggleWishlist) return;
    setWishlistUpdatingId(productId);
    await toggleWishlist(productId);
    setWishlistUpdatingId(null);
  };

  const tabs = ["FEATURED", "RECENT", "ON SALE", "TOP RATED"];

  const getProductsForTab = (tab: string) => {
    switch (tab) {
      case "FEATURED":
        return products.filter((p) => p.discount && p.discount > 25);
      case "RECENT":
        return products.slice(0, 3);
      case "ON SALE":
        return products.filter(
          (p) => p.originalPrice && p.originalPrice > p.price
        );
      case "TOP RATED":
        return products.filter((p) => p.rating && p.rating >= 4.5);
      default:
        return products.slice(0, 3);
    }
  };

  const tabProducts = showAll ? products : getProductsForTab(activeTab);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[200px]'>
        <span>Loading products...</span>
      </div>
    );
  }

  return (
    <section className='my-12'>
      {/* Tab Navigation */}
      <div className='flex flex-wrap gap-8 mb-8 border-b dark:border-gray-700'>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setShowAll(false);
            }}
            className={`pb-3 px-1 font-medium transition-all duration-200 relative transform hover:scale-105 hover:text-yellow-500 focus:outline-none ${
              !showAll && activeTab === tab
                ? "text-foreground dark:text-yellow-100 border-b-2 border-yellow-400"
                : "text-muted-foreground dark:text-yellow-100"
            }`}
          >
            {tab}
          </button>
        ))}
        <div className='ml-auto'>
          <button
            className={`bg-muted dark:bg-gray-800 text-muted-foreground dark:text-yellow-100 px-4 py-2 rounded text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:bg-yellow-400 dark:hover:bg-yellow-600 hover:text-black dark:hover:text-gray-900 focus:outline-none ${
              showAll ? "ring-2 ring-yellow-400 dark:ring-yellow-600" : ""
            }`}
            onClick={() => setShowAll(true)}
          >
            VIEW ALL
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {tabProducts.map((product) => {
          const discountPercentage = product.originalPrice
            ? Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
              )
            : 0;
          const isWishlisted = wishlist.includes(product._id);

          return (
            <div
              key={product._id}
              className='bg-white dark:bg-gray-800 rounded-lg border dark:border-yellow-600 hover:shadow-lg transition-all duration-300 group relative overflow-hidden'
            >
              {/* Discount Badge */}
              {discountPercentage > 0 && (
                <span className='absolute top-3 left-3 z-10 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded'>
                  {discountPercentage}% Off
                </span>
              )}

              {/* Featured Badge */}
              {product.discount && product.discount > 30 && (
                <span className='absolute top-3 right-3 z-10 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded'>
                  Featured
                </span>
              )}

              {/* Wishlist Button */}
              {toggleWishlist && (
                <button
                  className={`absolute bottom-3 right-3 z-10 p-2 rounded-full ${
                    isWishlisted
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-yellow-100"
                  }`}
                  onClick={() => handleToggleWishlist(product._id)}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                  disabled={wishlistUpdatingId === product._id}
                >
                  {wishlistUpdatingId === product._id ? (
                    <span className='loader h-4 w-4' />
                  ) : (
                    "♥"
                  )}
                </button>
              )}

              {/* Product Image */}
              <div
                className='cursor-pointer'
                onClick={() => onProductClick(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className='w-full h-48 object-cover rounded-t-lg'
                />
              </div>

              {/* Product Info */}
              <div className='p-4 space-y-2'>
                <h3
                  className='font-bold text-lg text-gray-900 dark:text-yellow-100 cursor-pointer'
                  onClick={() => onProductClick(product)}
                >
                  {product.name}
                </h3>
                <p className='text-sm text-muted-foreground dark:text-yellow-100'>
                  {getCategoryName(product.category)}
                </p>
                <div className='flex items-center gap-2'>
                  <span className='font-bold text-xl text-primary dark:text-yellow-400'>
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className='line-through text-muted-foreground dark:text-yellow-100 text-sm'>
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                <button
                  className={`mt-2 w-full bg-primary text-white py-2 rounded font-semibold transition-all ${
                    addingToCartId === product._id
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-yellow-500"
                  } flex items-center justify-center gap-2`}
                  onClick={() => handleAddToCart(product)}
                  disabled={addingToCartId === product._id}
                >
                  {addingToCartId === product._id ? (
                    <span className='loader h-4 w-4' />
                  ) : (
                    "Add to Cart"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductTabs;
