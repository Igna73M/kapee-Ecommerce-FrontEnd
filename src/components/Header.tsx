import { Search, ShoppingCart, User, Heart, Menu } from "lucide-react";
import { Link } from "react-router-dom";

import { useState } from "react";
import { Product } from "@/types/product";
import CategorySidebar from "../components/CategorySidebar";
import Login from "@/components/Login";

interface HeaderProps {
  cart: { product: Product; quantity: number }[];
  wishlist?: string[];
  onCartClick?: () => void;
}

const Header = ({ cart = [], wishlist = [], onCartClick }: HeaderProps) => {
  const [showCategorySidebar, setShowCategorySidebar] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

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
              <select
                id='language-select'
                className='bg-transparent border-none text-black outline-none'
                aria-label='Select language'
                defaultValue='ENGLISH'
              >
                <option value='ENGLISH'>ENGLISH</option>
                <option value='SPANISH'>SPANISH</option>
                <option value='FRENCH'>FRENCH</option>
              </select>
              <select
                id='currency-select'
                className='bg-transparent border-none text-black outline-none'
                aria-label='Select currency'
                defaultValue='USD'
              >
                <option value='USD'>$ DOLLAR (US)</option>
                <option value='EUR'>€ EURO</option>
                <option value='GBP'>£ POUND (UK)</option>
              </select>
            </div>
            <button
              className='md:hidden block p-2'
              aria-label={showMobileNav ? "Close menu" : "Open menu"}
              onClick={() => setShowMobileNav((prev) => !prev)}
            >
              <Menu
                className={`h-5 w-5 transition-transform ${
                  showMobileNav ? "rotate-90" : ""
                }`}
              />
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
          <div className='flex flex-col md:flex-row items-center md:items-stretch justify-between gap-4 w-full'>
            {/* Logo */}
            <div className='flex-shrink-0 flex items-center w-full md:w-auto justify-center md:justify-start mb-2 md:mb-0'>
              <Link to='/' className='text-3xl font-bold text-foreground'>
                kapee.
              </Link>
            </div>

            {/* Search Bar */}
            <div className='w-full md:flex-1 flex items-center justify-center md:justify-center order-3 md:order-none mt-2 md:mt-0'>
              <div className='flex flex-1 border rounded-lg w-full min-w-0'>
                <input
                  type='text'
                  placeholder='Search for products, categories, brands, sku...'
                  className='border-0 rounded-none py-3 px-4 focus:ring-0 w-full min-w-0'
                />
                <select className='bg-muted px-4 border-l text-sm outline-none min-w-[110px]'>
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
                <button
                  className='rounded-none px-6 bg-foreground text-background hover:bg-foreground/90'
                  type='button'
                >
                  <Search className='h-4 w-4 text-yellow-400' />
                </button>
              </div>
            </div>

            {/* User Actions */}
            <div className='flex items-center gap-4 md:gap-6 w-full md:w-auto justify-center md:justify-end mt-2 md:mt-0'>
              <div
                className='hidden md:flex items-center gap-2 text-sm cursor-pointer'
                onClick={() => setShowLogin(true)}
              >
                <User className='h-4 w-4' />
                <div>
                  <div className='text-xs text-muted-foreground'>HELLO</div>
                  <div className='font-semibold'>SIGN IN</div>
                </div>
              </div>

              <Link to='/wishlist'>
                <button
                  className='relative bg-transparent border-0 p-0'
                  aria-label='View wishlist'
                  type='button'
                >
                  <Heart className='h-5 w-5' />
                  {wishlistCount > 0 && (
                    <span className='absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs'>
                      {wishlistCount}
                    </span>
                  )}
                </button>
              </Link>

              <div className='flex items-center gap-2'>
                <button
                  className='relative bg-transparent border-0 p-0'
                  onClick={onCartClick}
                  aria-label='View cart'
                  type='button'
                >
                  <ShoppingCart className='h-5 w-5' />
                  {cartCount > 0 && (
                    <span className='absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs'>
                      {cartCount}
                    </span>
                  )}
                </button>
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
            {/* Desktop nav */}
            <div className='hidden md:flex flex-row items-center justify-between gap-4'>
              <div className='flex flex-wrap items-center gap-4 md:gap-8 justify-center md:justify-start w-full'>
                <button
                  className='bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 md:px-6 md:py-3 relative text-xs md:text-base'
                  onClick={() => setShowCategorySidebar((prev) => !prev)}
                  type='button'
                >
                  <Menu className='h-4 w-4 mr-2' />
                  <span className='hidden sm:inline'>SHOP BY CATEGORIES</span>
                  <span className='inline sm:hidden'>CATEGORIES</span>
                  <CategorySidebar
                    open={showCategorySidebar}
                    onClose={() => setShowCategorySidebar(false)}
                  />
                </button>
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
              <Link to='/checkout'>
                <button
                  className='bg-primary text-primary-foreground hover:bg-primary/90 px-4 md:px-6 text-xs md:text-base'
                  type='button'
                >
                  BUY NOW
                </button>
              </Link>
            </div>
            {/* Mobile nav */}
            {showMobileNav && (
              <div className='flex flex-col md:hidden gap-4 mt-4 animate-fade-in'>
                <button
                  className='bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 relative text-xs'
                  onClick={() => setShowCategorySidebar((prev) => !prev)}
                  type='button'
                >
                  <Menu className='h-4 w-4 mr-2' />
                  CATEGORIES
                  <CategorySidebar
                    open={showCategorySidebar}
                    onClose={() => setShowCategorySidebar(false)}
                  />
                </button>
                <Link
                  to='/'
                  className='font-medium hover:text-primary smooth-transition text-xs'
                  onClick={() => setShowMobileNav(false)}
                >
                  HOME
                </Link>
                <Link
                  to='/shop'
                  className='font-medium hover:text-primary smooth-transition text-xs'
                  onClick={() => setShowMobileNav(false)}
                >
                  SHOP
                </Link>
                <span className='font-medium hover:text-primary smooth-transition cursor-pointer text-xs'>
                  PAGES
                </span>
                <Link
                  to='/blog'
                  className='font-medium hover:text-primary smooth-transition text-xs'
                  onClick={() => setShowMobileNav(false)}
                >
                  BLOG
                </Link>
                <span className='font-medium hover:text-primary smooth-transition cursor-pointer text-xs'>
                  ELEMENTS
                </span>
                <button
                  className='bg-primary text-primary-foreground hover:bg-primary/90 px-4 text-xs'
                  type='button'
                >
                  BUY NOW
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>
      {/* Mobile SIGN IN button (optional, if you want it in mobile nav) */}
      {showMobileNav && (
        <div className='flex flex-col md:hidden gap-4 mt-4 animate-fade-in'>
          <button
            className='text-xs border border-gray-300 rounded px-3 py-1 bg-white hover:bg-gray-100'
            onClick={() => setShowLogin(true)}
            type='button'
          >
            SIGN IN
          </button>
        </div>
      )}
      {/* Login Popup */}
      <Login open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default Header;
