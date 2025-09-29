import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

interface Product {
  name?: string;
  price?: number;
}

interface OrderItem {
  product?: Product;
  price?: number;
  quantity: number;
}

interface Shipping {
  name: string;
  address: string;
  city: string;
  country: string;
  email: string;
}

interface Order {
  items?: OrderItem[];
  total?: number;
  shipping?: Shipping;
}

// Add your component here
const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get order data from location state or set a default
  const order: Order = location.state?.order || {
    items: [],
    total: 0,
    shipping: undefined,
  };

  return (
    <div>
      <TopBanner />
      <main className='container mx-auto py-8'>
        {order.items && Array.isArray(order.items) && (
          <ul className='mb-4'>
            {order.items.map((item: OrderItem, idx: number) => (
              <li
                key={idx}
                className='flex justify-between py-1 text-gray-900 dark:text-yellow-100'
              >
                <span>
                  {item.product?.name || "Product"} × {item.quantity}
                </span>
                <span>
                  $
                  {(
                    (item.product?.price ?? item.price ?? 0) * item.quantity
                  ).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
        {order && (
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8 text-left'>
            <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-yellow-100'>
              Order Summary
            </h2>
            {order.items && Array.isArray(order.items) && (
              <ul className='mb-4'>
                {order.items.map((item: OrderItem, idx: number) => (
                  <li
                    key={idx}
                    className='flex justify-between py-1 text-gray-900 dark:text-yellow-100'
                  >
                    <span>
                      {item.product?.name || "Product"} × {item.quantity}
                    </span>
                    <span>
                      $
                      {(
                        (item.product?.price ?? item.price ?? 0) * item.quantity
                      ).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className='flex justify-between font-bold text-lg text-gray-900 dark:text-yellow-100'>
              <span>Total</span>
              <span>${order.total ? order.total.toFixed(2) : ""}</span>
            </div>
            {order.shipping && (
              <div className='mt-4 text-sm text-gray-700 dark:text-yellow-100'>
                <div>
                  <span className='font-semibold'>Shipping to:</span>
                  <br />
                  {order.shipping.name}, {order.shipping.address},{" "}
                  {order.shipping.city}, {order.shipping.country}
                  <br />
                  {order.shipping.email}
                </div>
              </div>
            )}
          </div>
        )}
        <button
          onClick={() => navigate("/shop")}
          className='px-6 py-3 bg-primary text-white rounded font-semibold hover:bg-primary/90'
        >
          Continue Shopping
        </button>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default OrderSuccess;
