import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className='fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-primary dark:bg-yellow-500 text-primary-foreground dark:text-gray-900 shadow-lg hover:bg-primary/90 dark:hover:bg-yellow-400 flex items-center justify-center transition-colors duration-150'
          aria-label='Scroll to top'
        >
          <ArrowUp className='h-5 w-5' />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
