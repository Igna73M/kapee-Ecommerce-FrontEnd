import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { heroSlides } from "@/data/heroSlides";
import { useNavigate } from "react-router-dom";
import { products } from "@/data/products";
import { Product } from "@/types/product";

interface HeroSectionProps {
  addToCart: (product: Product, quantity?: number) => void;
  openCart: () => void;
}

const HeroSection = ({ addToCart, openCart }: HeroSectionProps) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  // Helper to find the product for the current slide
  const getProductForSlide = useCallback(() => {
    const slide = heroSlides[currentSlide];
    return products.find((p) => p.image === slide.image);
  }, [currentSlide]);
  const [animating, setAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setAnimating(false);
    }, 350); // match animation duration
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

  // Auto-slide with medium interval (e.g., 4 seconds)
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, 4000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentSlide]);

  const slide = heroSlides[currentSlide];

  return (
    <div className='relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg overflow-hidden'>
      <div className='flex items-center min-h-[400px] p-8 md:p-12 transition-transform duration-700 ease-in-out'>
        {/* Slide Content with pop-in animation */}
        <div
          className={`flex-1 space-y-6 ${animating ? "" : "animate-pop-in"}`}
        >
          <div className='space-y-2'>
            <div className='text-primary text-sm font-semibold tracking-wider'>
              {slide.title}
            </div>
            <h1 className='text-4xl md:text-6xl font-bold leading-tight'>
              <div className='text-gradient'>{slide.subtitle}</div>
              <div className='text-foreground'>{slide.highlight}</div>
            </h1>
            <div className='text-lg md:text-xl text-muted-foreground'>
              {slide.discount}
            </div>
          </div>

          <Button
            variant='hero'
            size='xl'
            className='mt-8'
            onClick={() => {
              const product = getProductForSlide();
              if (product) {
                addToCart(product, 1);
                openCart();
              }
              navigate("/checkout");
            }}
          >
            {slide.buttonText}
          </Button>
        </div>

        <div
          className={`flex-1 relative ${animating ? "" : "animate-pop-in"}`}
          style={{ animationDelay: animating ? "0ms" : "100ms" }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className='w-full h-full max-w-md mx-auto drop-shadow-2xl'
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant='ghost'
        size='icon'
        className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white'
        onClick={prevSlide}
      >
        <ChevronLeft className='h-6 w-6' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white'
        onClick={nextSlide}
      >
        <ChevronRight className='h-6 w-6' />
      </Button>

      {/* Slide Indicators */}
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 '>
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors border border-yellow-300 ${
              index === currentSlide ? "bg-primary" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
