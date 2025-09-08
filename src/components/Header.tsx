import { Search, ShoppingCart, User, Heart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

import { useState } from "react";
import { Product } from "@/types/product";
import CategorySidebar from "../components/CategorySidebar";

interface HeaderProps {
  cart: { product: Product; quantity: number }[];
  wishlist?: string[];
  onCartClick?: () => void;
}

const Header = ({ cart = [], wishlist = [], onCartClick }: HeaderProps) => {
  const [showCategorySidebar, setShowCategorySidebar] = useState(false);

  // Calculate cart item count and total value
  const cartCount = Array.isArray(cart)
    ? cart.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0;
  const cartTotal = Array.isArray(cart)
    ? cart.reduce(
        (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
        0
      )
    : 0;

  // Calculate wishlist count
  const wishlistCount = Array.isArray(wishlist) ? wishlist.length : 0;
  return (
    <>
      {/* Language & Currency Bar */}
      <div className='bg-primary py-2 px-4 text-sm'>
        <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2'>
          <div className='flex items-center gap-4 text-black w-full md:w-auto justify-between'>
            <div className='flex gap-2'>
              <select className='bg-transparent border-none text-black outline-none'>
                <option>ENGLISH</option>
                <option>SPANISH</option>
                <option>FRENCH</option>
              </select>
              <select className='bg-transparent border-none text-black outline-none'>
                <option>$ DOLLAR (US)</option>
                <option>€ EURO</option>
                <option>£ POUND (UK)</option>
              </select>
            </div>
            <button className='md:hidden block p-2' aria-label='Open menu'>
              <Menu className='h-5 w-5' />
            </button>
          </div>
          <div className='hidden md:flex items-center gap-4 text-black'>
            <span>WELCOME TO OUR STORE!</span>
            <span>BLOG</span>
            <span>FAQ</span>
            <span>CONTACT US</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className='bg-background py-4 px-4'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            {/* Logo */}
            <Link
              to='/'
              className='text-3xl font-bold text-foreground mb-2 sm:mb-0'
            >
              kapee.
            </Link>

            {/* Search Bar */}
            <div className='w-full sm:w-auto flex-1 flex items-center justify-center sm:justify-start order-3 sm:order-none mt-2 sm:mt-0'>
              <div className='hidden md:flex relative flex-1 flex border rounded-lg overflow-hidden max-w-2xl'>
                <Input
                  type='text'
                  placeholder='Search for products, categories, brands, sku...'
                  className='border-0 rounded-none py-3 px-4 focus:ring-0'
                />
                <select className='bg-muted px-4 border-l text-sm outline-none'>
                  <option>All Categories</option>
                  <option value='shirt'>Shirt</option>
                  <option value='electronics'>Electronics</option>
                  <option value='furniture'>Furniture</option>
                  <option value='shoes'>Shoes</option>
                  <option value='watches'>Watches</option>
                  <option value='bags'>Bags</option>
                  <option value='jewelry'>Jewelry</option>
                  <option value='toys'>Toys</option>
                  <option value='kids'>Kids</option>
                  <option value='home-appliances'>Home Appliances</option>
                  <option value='sports'>Sports</option>
                  <option value='outdoor'>Outdoor</option>
                  <option value='automotive'>Automotive</option>
                  <option value='health-beauty'>Health & Beauty</option>
                  <option value='groceries'>Groceries</option>
                  <option value='pets'>Pets</option>
                  <option value='books'>Books</option>
                  <option value='music'>Music</option>
                  <option value='movies'>Movies</option>
                  <option value='games'>Games</option>
                  <option value='software'>Software</option>
                  <option value='services'>Services</option>
                  <option value='others'>Others</option>
                </select>
                <Button
                  variant='default'
                  className='rounded-none px-6 bg-foreground text-background hover:bg-foreground/90'
                >
                  <Search className='h-4 w-4 text-yellow-400' />
                </Button>
              </div>
            </div>

            {/* User Actions */}
            <div className='flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-end'>
              <div className='hidden md:flex items-center gap-2 text-sm'>
                <User className='h-4 w-4' />
                <div>
                  <div className='text-xs text-muted-foreground'>HELLO</div>
                  <div className='font-semibold'>SIGN IN</div>
                </div>
              </div>

              <Link to='/wishlist'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='relative'
                  aria-label='View wishlist'
                >
                  <Heart className='h-5 w-5' />
                  {wishlistCount > 0 && (
                    <Badge className='absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs'>
                      {wishlistCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              <div className='flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='relative'
                  onClick={onCartClick}
                  aria-label='View cart'
                >
                  <ShoppingCart className='h-5 w-5' />
                  {cartCount > 0 && (
                    <Badge className='absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs'>
                      {cartCount}
                    </Badge>
                  )}
                </Button>
                <div className='hidden md:block text-sm'>
                  <div className='text-xs text-muted-foreground'>Cart</div>
                  <div className='font-semibold'>
                    {cartCount > 0 ? `$${cartTotal.toFixed(2)}` : "$0.00"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className='mt-6 border-t pt-4'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
              <div className='flex flex-wrap items-center gap-4 md:gap-8 justify-center md:justify-start w-full'>
                <Button
                  className='bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 md:px-6 md:py-3 relative text-xs md:text-base'
                  onClick={() => setShowCategorySidebar((prev) => !prev)}
                >
                  <Menu className='h-4 w-4 mr-2' />
                  <span className='hidden sm:inline'>SHOP BY CATEGORIES</span>
                  <span className='inline sm:hidden'>CATEGORIES</span>
                  <CategorySidebar
                    open={showCategorySidebar}
                    onClose={() => setShowCategorySidebar(false)}
                  />
                </Button>

                <Link
                  to='/'
                  className='font-medium hover:text-primary smooth-transition text-xs md:text-base'
                >
                  HOME
                </Link>
                <Link
                  to='/shop'
                  className='font-medium hover:text-primary smooth-transition text-xs md:text-base'
                >
                  SHOP
                </Link>
                <span className='font-medium hover:text-primary smooth-transition cursor-pointer text-xs md:text-base'>
                  PAGES
                </span>
                <Link
                  to='/blog'
                  className='font-medium hover:text-primary smooth-transition text-xs md:text-base'
                >
                  BLOG
                </Link>
                <span className='font-medium hover:text-primary smooth-transition cursor-pointer text-xs md:text-base'>
                  ELEMENTS
                </span>
              </div>
              <Button className='bg-primary text-primary-foreground hover:bg-primary/90 px-4 md:px-6 text-xs md:text-base'>
                BUY NOW
              </Button>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
