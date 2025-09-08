import { useState } from "react";
import { products } from "@/data/products";
import { Product } from "@/types/product";

interface ProductTabsProps {
  onProductClick: (product: Product) => void;
}

const ProductTabs = ({ onProductClick }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState("FEATURED");
  const [showAll, setShowAll] = useState(false);

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

  return (
    <section className='my-12'>
      {/* Tab Navigation */}
      <div className='flex flex-wrap gap-8 mb-8 border-b'>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setShowAll(false);
            }}
            className={`pb-3 px-1 font-medium transition-all duration-200 relative transform hover:scale-105 hover:text-yellow-500 focus:outline-none ${
              !showAll && activeTab === tab
                ? "text-foreground border-b-2 border-yellow-400"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
        <div className='ml-auto'>
          <button
            className={`bg-muted text-muted-foreground px-4 py-2 rounded text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:bg-yellow-400 hover:text-black focus:outline-none ${
              showAll ? "ring-2 ring-yellow-400" : ""
            }`}
            onClick={() => setShowAll(true)}
          >
            VIEW ALL
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {tabProducts.map((product) => (
          <div
            key={product.id}
            className='flex gap-4 p-4 bg-card rounded-lg border hover:shadow-md transition-shadow'
          >
            <div className='w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0'>
              <img
                src={product.image}
                alt={product.name}
                className='w-full h-full object-cover cursor-pointer'
                onClick={() => onProductClick(product)}
              />
            </div>
            <div className='flex-1 min-w-0'>
              <h4
                className='font-medium text-sm leading-tight mb-1 cursor-pointer hover:text-primary transition-colors'
                onClick={() => onProductClick(product)}
              >
                {product.name}
              </h4>
              <div className='flex items-center gap-2'>
                <span className='font-bold text-sm'>${product.price}.00</span>
                {product.originalPrice &&
                  product.originalPrice !== product.price && (
                    <span className='text-xs text-muted-foreground line-through'>
                      ${product.originalPrice}.00
                    </span>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductTabs;
