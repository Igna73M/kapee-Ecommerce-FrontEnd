import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const TopBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className='bg-foreground text-background py-3 px-4 text-center absolute w-full top-0'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex items-center justify-center gap-4'>
          <span className='text-sm font-medium'>
            SUMMER SALE, Get 40% Off for all products.
          </span>
          <Button
            variant='outline'
            size='sm'
            className='bg-primary text-primary-foreground border-primary hover:bg-primary/90'
          >
            Click Here
          </Button>
        </div>
      </div>
      <Button
        variant='ghost'
        size='icon'
        className='absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-background hover:bg-background/20'
        onClick={() => setIsVisible(false)}
      >
        <X className='h-4 w-4' />
      </Button>
    </div>
  );
};

export default TopBanner;
