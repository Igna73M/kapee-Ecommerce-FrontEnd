import React, { useEffect, useState } from "react";
import axios from "axios";

type Account = {
  username?: string;
  // add other account properties if needed
};

type Order = {
  _id: string;
  status: string;
  total: number;
  // add other order properties if needed
};

type WishlistItem = {
  _id: string;
  name: string;
  // add other wishlist item properties if needed
};

// Helper to get accessToken from cookies
function getAccessTokenFromCookies(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// Helper to get username from cookies
function getUsernameFromCookies(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)username=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function ClientDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [account, setAccount] = useState<Account>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistError, setWishlistError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      setWishlistError(null);
      try {
        const token = getAccessTokenFromCookies();
        if (!token) {
          setError("You must be logged in to view your dashboard.");
          setLoading(false);
          return;
        }
        const headers = { Authorization: `Bearer ${token}` };
        // Fetch orders and wishlist separately for better error handling
        const ordersPromise = axios.get(
          "https://kapee-ecommerce-backend.onrender.com/api_v1/orders/me",
          { headers }
        );
        const wishlistPromise = axios.get(
          "https://kapee-ecommerce-backend.onrender.com/api_v1/wishlist/me",
          { headers }
        );
        const [ordersRes, wishlistRes] = await Promise.allSettled([
          ordersPromise,
          wishlistPromise,
        ]);
        // Orders
        if (ordersRes.status === "fulfilled") {
          setOrders(
            Array.isArray(ordersRes.value.data) ? ordersRes.value.data : []
          );
        } else {
          setOrders([]);
          setError(
            ordersRes.reason?.response?.data?.message ||
              ordersRes.reason?.message ||
              "Failed to fetch orders."
          );
        }
        // Wishlist
        if (wishlistRes.status === "fulfilled") {
          const wishlistProducts =
            wishlistRes.value.data?.items?.map(
              (item: { product: WishlistItem }) => item.product
            ) || [];
          setWishlist(wishlistProducts);
        } else {
          // If wishlist not found, treat as empty, but do not block dashboard
          if (
            wishlistRes.reason?.response?.data?.message === "Wishlist not found"
          ) {
            setWishlist([]);
            setWishlistError("Your wishlist is empty.");
          } else {
            setWishlist([]);
            setWishlistError(
              wishlistRes.reason?.response?.data?.message ||
                wishlistRes.reason?.message ||
                "Failed to fetch wishlist."
            );
          }
        }
        // Get username from cookie instead of endpoint
        setAccount({ username: getUsernameFromCookies() || "User" });
      } catch (err) {
        setOrders([]);
        setWishlist([]);
        setAccount({ username: getUsernameFromCookies() || "User" });
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch dashboard data."
        );
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const darkMode = localStorage.getItem("dashboardDarkMode") === "true";
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  return (
    <div className='p-6 bg-white dark:bg-gray-900 min-h-screen'>
      <h2 className='text-xl font-bold mb-4 text-gray-900 dark:text-yellow-100'>
        My Dashboard
      </h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className='text-red-500 dark:text-red-400 text-center'>
          {error}
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
            <div className='bg-blue-100 dark:bg-blue-900 rounded p-4 text-center'>
              <div className='text-2xl font-bold text-gray-900 dark:text-yellow-100'>
                {orders.length}
              </div>
              <div className='text-sm text-gray-700 dark:text-yellow-100'>
                Orders
              </div>
            </div>
            <div className='bg-pink-100 dark:bg-pink-900 rounded p-4 text-center'>
              <div className='text-2xl font-bold text-gray-900 dark:text-yellow-100'>
                {wishlist.length}
              </div>
              <div className='text-sm text-gray-700 dark:text-yellow-100'>
                Wishlist Items
              </div>
            </div>
            <div className='bg-green-100 dark:bg-green-900 rounded p-4 text-center'>
              <div className='text-2xl font-bold text-gray-900 dark:text-yellow-100'>
                {account?.username || "User"}
              </div>
              <div className='text-sm text-gray-700 dark:text-yellow-100'>
                Account
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-32'>
            <div>
              <h3 className='font-semibold mb-2 text-center text-gray-900 dark:text-yellow-100'>
                Recent Orders
              </h3>
              <div className='bg-white dark:bg-gray-800 rounded shadow p-4'>
                {orders.length === 0 ? (
                  <div className='text-gray-500 dark:text-yellow-100 text-center'>
                    No orders yet.
                  </div>
                ) : (
                  <ul className='divide-y divide-gray-200 dark:divide-gray-700 '>
                    {orders.slice(0, 5).map((order) => (
                      <li key={order._id} className='py-2 flex justify-between'>
                        <span className='font-bold text-gray-900 dark:text-yellow-100'>
                          <span className='font-semibold underline'>
                            Order ID
                          </span>{" "}
                          : #{order._id}
                        </span>{" "}
                        {order.status}{" "}
                        <span className='font-semibold'>${order.total}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div>
              <h3 className='font-semibold mb-2 text-center text-gray-900 dark:text-yellow-100'>
                Wishlist
              </h3>
              <div className='bg-white dark:bg-gray-800 rounded shadow p-4'>
                {wishlist.length === 0 ? (
                  <div className='text-gray-500 dark:text-yellow-100 text-center'>
                    {wishlistError || "Your wishlist is empty."}
                  </div>
                ) : (
                  <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
                    {wishlist.slice(0, 5).map((item) => (
                      <li key={item._id || item.name} className='py-2'>
                        <span className='font-bold text-gray-900 dark:text-yellow-100'>
                          {item.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ClientDashboard;
