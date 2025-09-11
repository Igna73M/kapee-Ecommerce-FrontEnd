import { Button } from "@/components/ui/button";
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
            className='relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg overflow-hidden group cursor-pointer card-shadow'
          >
            <div className='flex items-center p-6 md:p-8 min-h-[250px]'>
              <div className='flex-1 space-y-4'>
                <div className='space-y-2'>
                  <div className='text-primary text-xs font-semibold tracking-wider'>
                    {banner.title}
                  </div>
                  <h3 className='text-2xl md:text-3xl font-bold leading-tight'>
                    {banner.subtitle}
                  </h3>
                  <div className='text-sm text-muted-foreground'>
                    {banner.discount}
                  </div>
                </div>

                <Button
                  variant='shop'
                  size='sm'
                  onClick={() => {
                    if (product) {
                      addToCart(product, 1);
                      openCart();
                    }
                    navigate("/checkout");
                  }}
                >
                  {banner.buttonText}
                </Button>
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
