import { Search, ShoppingCart, User, Heart, Menu } from "lucide-react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import CategorySidebar from "../components/CategorySidebar";
import Login from "@/components/Login";
import { Notify } from "notiflix";

interface HeaderProps {
  cart: { product: Product; quantity: number }[];
  wishlist?: string[];
  onCartClick?: () => void;
}

const Header = ({ cart = [], wishlist = [], onCartClick }: HeaderProps) => {
  const location = useLocation();
  const [showCategorySidebar, setShowCategorySidebar] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [wishlistState, setWishlistState] = useState<string[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Helper to get cookie value
  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  }

  // On mount, check for username in cookies
  useEffect(() => {
    setUsername(getCookie("username"));
  }, []);

  // Wishlist sync: fetch from backend if logged in, else from localStorage
  useEffect(() => {
    async function fetchWishlist() {
      setLoadingWishlist(true);
      const accessToken = getCookie("accessToken");
      if (accessToken) {
        try {
          const res = await axios.get(
            `https://kapee-ecommerce-backend.onrender.com/api_v1/wishlist/me`,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (Array.isArray(res.data?.wishlist)) {
            setWishlistState(res.data.wishlist);
            localStorage.setItem("wishlist", JSON.stringify(res.data.wishlist));
          } else {
            setWishlistState([]);
            localStorage.setItem("wishlist", "[]");
          }
        } catch (err) {
          setWishlistState([]);
          Notify.failure("Failed to fetch wishlist");
        }
      } else {
        // Not logged in: use localStorage
        try {
          const localWishlist = JSON.parse(
            localStorage.getItem("wishlist") || "[]"
          );
          setWishlistState(Array.isArray(localWishlist) ? localWishlist : []);
        } catch {
          setWishlistState([]);
        }
      }
      setLoadingWishlist(false);
    }
    fetchWishlist();
  }, [username, showLogin]);

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
  const wishlistCount = Array.isArray(wishlistState) ? wishlistState.length : 0;

  // Only show header if not on dashboard or return routes
  if (
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/client-dashboard")
  ) {
    return null;
  }
  return (
    <>
      {/* Language & Currency Bar */}
      <div className='bg-primary py-2 px-4 text-sm'>
        <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2'>
          <div className='flex items-center gap-4 text-black w-full md:w-auto justify-between'>
            <div className='flex gap-2'>
              <select
                id='language-select'
                className='bg-transparent border-none text-black dark:text-black outline-none'
                aria-label='Select language'
                defaultValue='ENGLISH'
              >
                <option value='ENGLISH'>ENGLISH</option>
                <option value='SPANISH'>SPANISH</option>
                <option value='FRENCH'>FRENCH</option>
              </select>
              <select
                id='currency-select'
                className='bg-transparent border-none text-black dark:text-black outline-none'
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
          <div className='hidden md:flex items-center gap-4 text-black dark:text-black'>
            <span>WELCOME TO OUR STORE!</span>
            <span>BLOG</span>
            <span>FAQ</span>
            <span>CONTACT US</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className='bg-background dark:bg-gray-900 py-4 px-4'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col md:flex-row items-center md:items-stretch justify-between gap-4 w-full'>
            {/* Logo */}
            <div className='flex-shrink-0 flex items-center w-full md:w-auto justify-center md:justify-start mb-2 md:mb-0'>
              <Link
                to='/'
                className='text-3xl font-bold text-foreground dark:text-yellow-100'
              >
                kapee.
              </Link>
            </div>

            {/* Search Bar */}
            <div className='w-full md:flex-1 flex items-center justify-center md:justify-center order-3 md:order-none mt-2 md:mt-0'>
              <div className='flex flex-1 border dark:border-gray-700 rounded-lg w-full min-w-0 bg-white dark:bg-gray-800'>
                <input
                  type='text'
                  placeholder='Search for products, categories, brands, sku...'
                  className='border-0 rounded-none py-3 px-4 focus:ring-0 w-full min-w-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                />
                <select className='bg-muted dark:bg-gray-700 px-4 border-l dark:border-gray-700 text-sm outline-none min-w-[110px] text-gray-900 dark:text-yellow-100'>
                  <option>All Categories</option>
                  {/* ...other options... */}
                </select>
                <button
                  className='rounded-md px-6 bg-foreground dark:bg-yellow-500 text-background dark:text-gray-900 hover:bg-foreground/90 dark:hover:bg-yellow-400'
                  type='button'
                >
                  <Search className='h-4 w-4 text-yellow-400 dark:text-gray-900' />
                </button>
              </div>
            </div>

            {/* User Actions */}
            <div className='flex items-center gap-4 md:gap-6 w-full md:w-auto justify-center md:justify-end mt-2 md:mt-0'>
              <div className='hidden md:flex items-center gap-2 text-sm relative'>
                <User className='h-4 w-4 dark:text-yellow-100' />
                <div>
                  <div className='text-xs text-muted-foreground dark:text-yellow-100'>
                    {username ? "WELCOME" : "HELLO"}
                  </div>
                  <div
                    className='font-semibold cursor-pointer text-gray-900 dark:text-yellow-100'
                    onClick={() => {
                      if (!username) setShowLogin(true);
                      else setShowUserMenu((prev) => !prev);
                    }}
                  >
                    {username ? username : "SIGN IN"}
                  </div>
                </div>
                {/* User dropdown menu */}
                {username && showUserMenu && (
                  <div className='absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded shadow-lg z-50 flex flex-col'>
                    <button
                      className='px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 border-b dark:border-gray-700 text-sm text-black dark:text-yellow-100'
                      onClick={() => {
                        function getCookie(name: string) {
                          const value = `; ${document.cookie}`;
                          const parts = value.split(`; ${name}=`);
                          if (parts.length === 2)
                            return parts.pop()?.split(";").shift() || null;
                          return null;
                        }
                        const userRole = getCookie("userRole");
                        if (userRole === "admin") {
                          window.location.href = "/dashboard";
                        } else if (userRole === "user") {
                          window.location.href = "/client-dashboard";
                        } else {
                          setShowLogin(true);
                        }
                        setShowUserMenu(false);
                      }}
                    >
                      Dashboard
                    </button>
                    <button
                      className='px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-black dark:text-yellow-100'
                      onClick={async () => {
                        try {
                          const email = localStorage.getItem("email");
                          if (email) {
                            await axios.post(
                              `https://kapee-ecommerce-backend.onrender.com/api_v1/user/logout`,
                              { email }
                            );
                          }
                          Notify.success("Logout Successful");
                        } catch (err) {
                          Notify.failure("Logout Failed");
                          console.error("Logout error:", err);
                        }
                        document.cookie =
                          "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        document.cookie =
                          "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        document.cookie =
                          "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        localStorage.removeItem("dashboardDarkMode");
                        localStorage.removeItem("email");
                        sessionStorage.clear();
                        setShowUserMenu(false);
                        window.location.reload();
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              <Link to='/client-dashboard/wishlist'>
                <button
                  className='relative bg-transparent border-0 p-0'
                  aria-label='View wishlist'
                  type='button'
                >
                  <Heart className='h-5 w-5 dark:text-yellow-100' />
                  {wishlistCount > 0 && (
                    <span className='absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary dark:bg-yellow-500 text-primary-foreground dark:text-gray-900 text-xs'>
                      {wishlistCount}
                    </span>
                  )}
                  {loadingWishlist && (
                    <span className='absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-xs animate-pulse'>
                      ...
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
                  <ShoppingCart className='h-5 w-5 dark:text-yellow-100' />
                  {cartCount > 0 && (
                    <span className='absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary dark:bg-yellow-500 text-primary-foreground dark:text-gray-900 text-xs'>
                      {cartCount}
                    </span>
                  )}
                </button>
                <div className='hidden md:block text-sm'>
                  <div className='text-xs text-muted-foreground dark:text-yellow-100'>
                    Cart
                  </div>
                  <div className='font-semibold text-gray-900 dark:text-yellow-100'>
                    {cartCount > 0 ? `$${cartTotal.toFixed(2)}` : "$0.00"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className='mt-6 border-t dark:border-gray-700 pt-4'>
            {/* Desktop nav */}
            <div className='hidden md:flex flex-row items-center justify-between gap-4'>
              <div className='flex flex-wrap items-center gap-2 md:gap-8 justify-center md:justify-center w-full'>
                <button
                  className='bg-primary text-primary-foreground dark:bg-yellow-500 dark:text-gray-900 hover:bg-primary/90 dark:hover:bg-yellow-400 px-4 py-2 lg:px-6 lg:py-3 relative text-xs md:text-base inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium'
                  onClick={() => setShowCategorySidebar((prev) => !prev)}
                  type='button'
                >
                  <Menu className='h-4 w-4 mr-2 dark:text-gray-900' />
                  <span className='hidden sm:inline'>SHOP BY CATEGORIES</span>
                  <span className='inline sm:hidden'>CATEGORIES</span>
                  <CategorySidebar
                    open={showCategorySidebar}
                    onClose={() => setShowCategorySidebar(false)}
                  />
                </button>
                <Link
                  to='/'
                  className='font-medium hover:text-primary dark:hover:text-yellow-400 smooth-transition text-xs md:text-base text-gray-900 dark:text-yellow-100'
                >
                  HOME
                </Link>
                <Link
                  to='/shop'
                  className='font-medium hover:text-primary dark:hover:text-yellow-400 smooth-transition text-xs md:text-base text-gray-900 dark:text-yellow-100'
                >
                  SHOP
                </Link>
                <Link
                  to='/blog'
                  className='font-medium hover:text-primary dark:hover:text-yellow-400 smooth-transition text-xs md:text-base text-gray-900 dark:text-yellow-100'
                >
                  BLOG
                </Link>
              </div>
            </div>
            {/* Mobile nav */}
            {showMobileNav && (
              <div className='flex flex-col md:hidden gap-4 mt-4 animate-fade-in'>
                <button
                  className='bg-primary text-primary-foreground dark:bg-yellow-500 dark:text-gray-900 hover:bg-primary/90 dark:hover:bg-yellow-400 px-4 py-2 relative text-xs'
                  onClick={() => setShowCategorySidebar((prev) => !prev)}
                  type='button'
                >
                  <Menu className='h-4 w-4 mr-2 dark:text-gray-900' />
                  CATEGORIES
                  <CategorySidebar
                    open={showCategorySidebar}
                    onClose={() => setShowCategorySidebar(false)}
                  />
                </button>
                <Link
                  to='/'
                  className='font-medium hover:text-primary dark:hover:text-yellow-400 smooth-transition text-xs text-gray-900 dark:text-yellow-100'
                  onClick={() => setShowMobileNav(false)}
                >
                  HOME
                </Link>
                <Link
                  to='/shop'
                  className='font-medium hover:text-primary dark:hover:text-yellow-400 smooth-transition text-xs text-gray-900 dark:text-yellow-100'
                  onClick={() => setShowMobileNav(false)}
                >
                  SHOP
                </Link>
                <Link
                  to='/blog'
                  className='font-medium hover:text-primary dark:hover:text-yellow-400 smooth-transition text-xs text-gray-900 dark:text-yellow-100'
                  onClick={() => setShowMobileNav(false)}
                >
                  BLOG
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
      {/* Mobile SIGN IN button (optional, if you want it in mobile nav) */}
      {showMobileNav && (
        <div className='flex flex-col md:hidden gap-4 mt-4 animate-fade-in'>
          <button
            className='text-xs border border-gray-300 dark:border-gray-700 rounded px-3 py-1 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-yellow-100'
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
