import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  highlight: string;
  discount: string;
  buttonText: string;
}

interface HeroSectionProps {
  addToCart: (product: Product, quantity?: number) => void;
  openCart: () => void;
}

const HeroSection = ({ addToCart, openCart }: HeroSectionProps) => {
  const navigate = useNavigate();
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api_v1/hero-slides")
      .then((res) => setHeroSlides(res.data))
      .catch(() => setHeroSlides([]));
    axios
      .get("http://localhost:5000/api_v1/products")
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  const getProductForSlide = useCallback(() => {
    if (!heroSlides.length || !products.length) return undefined;
    const slide = heroSlides[currentSlide];
    return products.find((p) => p.image === slide.image);
  }, [currentSlide, heroSlides, products]);

  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setAnimating(false);
    }, 350);
  };

  const prevSlide = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentSlide(
        (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
      );
      setAnimating(false);
    }, 350);
  };

  useEffect(() => {
    if (!heroSlides.length) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, 4000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentSlide, heroSlides.length, nextSlide]);

  if (!heroSlides.length) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <span>Loading hero slides...</span>
      </div>
    );
  }

  const slide = heroSlides[currentSlide];

  return (
    <div className='relative bg-gradient-to-br from-primary/10 to-primary/5 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden'>
      <div className='flex flex-col md:flex-row items-center min-h-[400px] p-6 md:p-12 transition-transform duration-700 ease-in-out gap-8'>
        {/* Slide Content */}
        <div
          className={`flex-1 space-y-6 w-full md:w-1/2 ${
            animating ? "" : "animate-pop-in"
          }`}
        >
          <div className='space-y-2'>
            <div className='text-primary dark:text-yellow-400 text-xs md:text-sm font-semibold tracking-wider'>
              {slide.title}
            </div>
            <h1 className='text-3xl md:text-5xl font-bold leading-tight mb-2'>
              <span className='block text-gradient dark:text-yellow-400'>
                {slide.subtitle}
              </span>
              <span className='block text-foreground dark:text-yellow-100'>
                {slide.highlight}
              </span>
            </h1>
            <div className='text-base md:text-lg text-muted-foreground dark:text-yellow-100'>
              {slide.discount}
            </div>
          </div>

          <button
            className='mt-6 md:mt-8 bg-primary dark:bg-yellow-500 text-primary-foreground dark:text-gray-900 px-6 md:px-8 py-2.5 md:py-3 rounded text-base md:text-lg font-bold shadow hover:bg-primary/90 dark:hover:bg-yellow-400 transition-colors duration-150'
            onClick={() => {
              const product = getProductForSlide();
              if (product) {
                addToCart(product, 1);
                openCart();
              }
              navigate("/checkout");
            }}
            type='button'
          >
            {slide.buttonText}
          </button>
        </div>

        {/* Slide Image */}
        <div
          className={`flex-1 flex items-center justify-center w-full md:w-1/2 ${
            animating ? "" : "animate-pop-in"
          }`}
          style={{ animationDelay: animating ? "0ms" : "100ms" }}
        >
          <div className='w-64 h-64 md:w-80 md:h-80 flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden'>
            <img
              src={slide.image}
              alt={slide.title}
              className='w-full h-full object-contain'
              style={{ minWidth: "100%", minHeight: "100%" }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow transition-colors duration-150'
        onClick={prevSlide}
        type='button'
        aria-label='Previous Slide'
        disabled={heroSlides.length === 0}
      >
        <ChevronLeft className='h-6 w-6 text-gray-900 dark:text-yellow-100' />
      </button>
      <button
        className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow transition-colors duration-150'
        onClick={nextSlide}
        type='button'
        aria-label='Next Slide'
        disabled={heroSlides.length === 0}
      >
        <ChevronRight className='h-6 w-6 text-gray-900 dark:text-yellow-100' />
      </button>

      {/* Slide Indicators */}
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2'>
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors border border-yellow-300 dark:border-yellow-500 ${
              index === currentSlide
                ? "bg-primary dark:bg-yellow-500"
                : "bg-white/50 dark:bg-gray-700"
            }`}
            onClick={() => setCurrentSlide(index)}
            disabled={heroSlides.length === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
