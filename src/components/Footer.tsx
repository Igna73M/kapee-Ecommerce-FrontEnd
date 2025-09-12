import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Rss,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className='bg-background'>
      {/* Main Footer Content */}
      <div className='bg-gray-50 py-12 border-t'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8'>
            {/* Company Info */}
            <div className='lg:col-span-1'>
              <h3 className='text-2xl font-bold text-foreground mb-4'>
                kapee.
              </h3>
              <p className='text-muted-foreground mb-6'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>

              <div className='space-y-3 text-sm text-muted-foreground'>
                <div className='flex items-center gap-2'>
                  <span>📍</span>
                  <span>Lorem Ipsum, 2046 Lorem Ipsum</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span>📞</span>
                  <span>576-245-2478</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span>✉️</span>
                  <span>info@kapee.com</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span>🕐</span>
                  <span>Mon - Fri / 9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

            {/* Information */}
            <div>
              <h4 className='font-semibold text-foreground mb-4'>
                INFORMATION
              </h4>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>
                  <a href='#' className='hover:text-primary'>
                    About Us
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary'>
                    Store Location
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary'>
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary'>
                    Shipping & Delivery
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary'>
                    Latest News
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary'>
                    Our Sitemap
                  </a>
                </li>
              </ul>
            </div>

            {/* Our Service */}
            <div>
              <h4 className='font-semibold text-foreground mb-4'>
                OUR SERVICE
              </h4>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>
                  <a href='#' className='hover:text-primary'>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary'>
                    Terms of Sale
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary'>
                    Customer Service
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary'>
                    Delivery Information
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary'>
                    Payments
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary'>
                    Saved Cards
                  </a>
                </li>
              </ul>
            </div>

            {/* My Account */}
            <div>
              <h4 className='font-semibold text-foreground mb-4'>MY ACCOUNT</h4>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>
                  <a href='#' className='hover:text-primary'>
                    My Account
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary'>
                    My Shop
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary'>
                    My Cart
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary'>
                    Checkout
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary'>
                    My Wishlist
                  </a>
                </li>
                <li>
                  <a href='#' className='hover:text-primary'>
                    Tracking Order
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className='font-semibold text-foreground mb-4'>NEWSLETTER</h4>
              <p className='text-sm text-muted-foreground mb-4'>
                Subscribe to our mailing list to get the new updates!
              </p>

              <div className='flex gap-2'>
                <input
                  type='email'
                  placeholder='Your email address'
                  className='flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary'
                />
                <button
                  className='bg-foreground text-background hover:bg-foreground/90 px-4 py-2 rounded font-semibold transition-colors duration-150'
                  type='button'
                >
                  SIGN UP
                </button>
              </div>

              {/* Social Media Icons */}
              <div className='flex gap-2 mt-6'>
                <button
                  className='bg-blue-600 hover:bg-blue-700 rounded-full p-2'
                  type='button'
                >
                  <Facebook className='h-4 w-8' />
                </button>
                <button
                  className='bg-black hover:bg-gray-800 rounded-full p-2'
                  type='button'
                >
                  <Twitter className='h-4 w-8' />
                </button>
                <button
                  className='bg-blue-700 hover:bg-blue-800 rounded-full p-2'
                  type='button'
                >
                  <Linkedin className='h-4 w-8' />
                </button>
                <button
                  className='bg-pink-500 hover:bg-pink-600 rounded-full p-2'
                  type='button'
                >
                  <Instagram className='h-4 w-8' />
                </button>
                <button
                  className='bg-pink-600 hover:bg-pink-700 rounded-full p-2'
                  type='button'
                >
                  <span className='text-xs font-bold'>D</span>
                </button>
                <button
                  className='bg-orange-500 hover:bg-orange-600 rounded-full p-2'
                  type='button'
                >
                  <Rss className='h-4 w-8' />
                </button>
                <button
                  className='bg-red-600 hover:bg-red-700 rounded-full p-2'
                  type='button'
                >
                  <Youtube className='h-4 w-8' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright and Payment Methods Section */}
      <div className='bg-white border-t py-4'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            {/* Copyright */}
            <div className='text-sm text-muted-foreground'>
              Kapee © 2025 by PressLayouts All Rights Reserved.
            </div>

            {/* Payment Methods */}
            <div className='flex items-center gap-2'>
              <img
                src='https://img.icons8.com/color/48/visa.png'
                alt='Visa'
                className='h-8 w-auto'
              />
              <img
                src='https://img.icons8.com/color/48/paypal.png'
                alt='PayPal'
                className='h-8 w-auto'
              />
              <img
                src='https://img.icons8.com/color/48/discover.png'
                alt='Discover'
                className='h-8 w-auto'
              />
              <img
                src='https://img.icons8.com/color/48/maestro.png'
                alt='Maestro'
                className='h-8 w-auto'
              />
              <img
                src='https://img.icons8.com/color/48/mastercard.png'
                alt='MasterCard'
                className='h-8 w-auto'
              />
              <img
                src='https://img.icons8.com/color/48/amex.png'
                alt='American Express'
                className='h-8 w-auto'
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
