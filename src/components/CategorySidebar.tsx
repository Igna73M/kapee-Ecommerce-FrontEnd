import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  category: string; // category _id
}

interface CategorySidebarProps {
  open: boolean;
  onClose: () => void;
}

const CategorySidebar = ({ open, onClose }: CategorySidebarProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  // Track active product for feedback (e.g. loading, highlight)
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      axios.get(
        `https://kapee-ecommerce-backend.onrender.com/api_v1/brand-categories`
      ),
      axios.get(`https://kapee-ecommerce-backend.onrender.com/api_v1/products`),
    ])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data);
        setProducts(prodRes.data);
      })
      .catch(() => {
        setCategories([]);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!open) return null;

  if (loading) {
    return (
      <div className='bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-700 top-12 -left-1 z-50 w-60 h-fit absolute flex items-center justify-center min-h-[150px]'>
        <span>Loading categories...</span>
      </div>
    );
  }

  // Example: handler for product click (could add to cart, wishlist, etc.)
  const handleProductClick = async (product: Product) => {
    setActiveProductId(product.id);
    // Simulate async action (e.g. add to cart/wishlist)
    setTimeout(() => setActiveProductId(null), 800);
    // You can add your logic here (e.g. addToCart(product), etc.)
  };

  return (
    <div className='bg-white dark:bg-gray-900 rounded-lg shadow-sm border dark:border-gray-700 top-12 -left-1 z-50 w-60 h-fit absolute'>
      <div className='bg-white dark:bg-gray-900 relative'>
        {categories.map((category) => {
          // Find products in this category
          const productsInCategory = products.filter(
            (p) => p.category === category._id
          );
          return (
            <div
              key={category._id}
              className='flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer relative'
              onMouseEnter={() => setHoveredCategory(category._id)}
              onMouseLeave={() =>
                setHoveredCategory((prev) =>
                  prev === category._id ? null : prev
                )
              }
            >
              <span className='text-sm text-gray-700 dark:text-yellow-100 group-hover:text-primary dark:group-hover:text-yellow-400'>
                {category.name}
              </span>
              <ChevronRight className='h-4 w-4 text-gray-400 dark:text-yellow-100 group-hover:text-primary dark:group-hover:text-yellow-400' />
              {hoveredCategory === category._id &&
                productsInCategory.length > 0 && (
                  <ul className='bg-white dark:bg-gray-900 shadow-lg rounded-lg py-2 px-3 text-black dark:text-yellow-100 absolute left-full top-0 flex flex-col border dark:border-gray-700 min-w-[150px]'>
                    {productsInCategory.map((item) => (
                      <li
                        key={item.id}
                        className={`px-3 py-2 hover:bg-yellow-200 dark:hover:bg-yellow-600 cursor-pointer text-sm text-gray-700 dark:text-yellow-100 rounded transition-colors duration-150 text-left flex items-center gap-2 ${
                          activeProductId === item.id
                            ? "bg-yellow-100 dark:bg-yellow-700"
                            : ""
                        }`}
                        onClick={() => handleProductClick(item)}
                      >
                        {item.name}
                        {activeProductId === item.id && (
                          <span className='loader h-3 w-3 ml-2' />
                        )}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySidebar;
