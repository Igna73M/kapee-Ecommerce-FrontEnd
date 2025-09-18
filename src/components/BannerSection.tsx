import { banners } from "@/data/banners";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";

interface BannerSectionProps {
  addToCart: (product: Product, quantity?: number) => void;
  openCart: () => void;
  products: Product[];
}

const BannerSection = ({
  addToCart,
  openCart,
  products,
}: BannerSectionProps) => {
  const navigate = useNavigate();
  return (
    <div className='grid md:grid-cols-2 gap-6'>
      {banners.map((banner) => {
        // Try to find a product matching the banner image
        const product = products.find((p) => p.image === banner.image);
        return (
          <div
            key={banner.id}
            className='relative bg-gradient-to-br from-primary/10 to-primary/5 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden group cursor-pointer card-shadow'
          >
            <div className='flex items-center p-6 md:p-8 min-h-[250px]'>
              <div className='flex-1 space-y-4'>
                <div className='space-y-2'>
                  <div className='text-primary dark:text-yellow-400 text-xs font-semibold tracking-wider'>
                    {banner.title}
                  </div>
                  <h3 className='text-2xl md:text-3xl font-bold leading-tight text-gray-900 dark:text-yellow-100'>
                    {banner.subtitle}
                  </h3>
                  <div className='text-sm text-muted-foreground dark:text-yellow-100'>
                    {banner.discount}
                  </div>
                </div>

                <button
                  className='bg-primary text-primary-foreground dark:bg-yellow-500 dark:text-gray-900 px-4 py-2 rounded hover:bg-primary/90 dark:hover:bg-yellow-400 text-sm font-semibold transition-colors duration-150 mt-4'
                  onClick={() => {
                    if (product) {
                      addToCart(product);
                      openCart();
                    }
                  }}
                  type='button'
                >
                  {banner.buttonText}
                </button>
              </div>
              <div className='flex-1'>
                <img
                  src={banner.image}
                  alt={banner.subtitle}
                  className='w-full h-auto max-w-[200px] mx-auto group-hover:scale-105 smooth-transition drop-shadow-xl'
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BannerSection;
