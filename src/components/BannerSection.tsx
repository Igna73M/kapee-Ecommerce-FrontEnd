import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Product } from "@/types/product";

interface Banner {
  id?: string | number;
  image: string;
  title: string;
  subtitle: string;
  discount: string;
  buttonText: string;
}

interface BannerSectionProps {
  addToCart: (product: Product, quantity?: number) => void;
  openCart: () => void;
}

const BannerSection = ({ addToCart, openCart }: BannerSectionProps) => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCartId, setAddingToCartId] = useState<string | number | null>(
    null
  );

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:5000/api_v1/banners"),
      axios.get("http://localhost:5000/api_v1/products"),
    ])
      .then(([bannersRes, productsRes]) => {
        setBanners(bannersRes.data);
        setProducts(productsRes.data);
      })
      .catch(() => {
        setBanners([]);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[250px]'>
        <span>Loading banners...</span>
      </div>
    );
  }

  if (!banners.length) {
    return (
      <div className='flex items-center justify-center min-h-[250px]'>
        <span>No banners available.</span>
      </div>
    );
  }

  const handleAddToCart = async (
    bannerId: string | number,
    product: Product | undefined
  ) => {
    if (!product) return;
    setAddingToCartId(bannerId);
    await addToCart(product);
    setAddingToCartId(null);
    openCart();
  };

  return (
    <div className='grid md:grid-cols-2 gap-6'>
      {banners.map((banner, idx) => {
        const product = products.find((p) => p.image === banner.image);
        const isAdding = addingToCartId === banner.id;
        return (
          <div
            key={banner.id ?? idx} // fallback to index if id is missing
            className='relative bg-gradient-to-br from-primary/10 to-primary/5 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden group cursor-pointer card-shadow'
          >
            <div className='flex items-center p-6 md:p-8 min-h-[250px]'>
              <div className='flex-1 space-y-4'>
                <div className='space-y-2'>
                  <div className='text-primary dark:text-yellow-400 text-xl font-semibold tracking-wider'>
                    {banner.title}
                  </div>
                  <h3 className='text-base font-bold leading-tight text-gray-900 dark:text-yellow-100'>
                    {banner.subtitle}
                  </h3>
                  <div className='text-sm text-muted-foreground dark:text-yellow-100'>
                    {banner.discount}
                  </div>
                </div>

                <button
                  className='bg-primary text-primary-foreground dark:bg-yellow-500 dark:text-gray-900 px-4 py-2 rounded hover:bg-primary/90 dark:hover:bg-yellow-400 text-sm font-semibold transition-colors duration-150 mt-4 flex items-center justify-center gap-2'
                  onClick={() => handleAddToCart(banner.id ?? idx, product)}
                  type='button'
                  disabled={isAdding}
                >
                  {isAdding ? (
                    <span className='loader h-4 w-4' />
                  ) : (
                    banner.buttonText
                  )}
                </button>
              </div>
              <div className='flex-1 w-full h-full flex items-center justify-center'>
                <div className='w-40 h-40 md:w-56 md:h-56 flex items-center justify-center'>
                  <img
                    src={banner.image}
                    alt={banner.subtitle}
                    className='w-full h-full object-cover rounded-lg mx-auto group-hover:scale-105 smooth-transition drop-shadow-xl'
                    style={{ aspectRatio: "1/1" }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BannerSection;
