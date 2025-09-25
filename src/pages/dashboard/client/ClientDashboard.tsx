import React, { useEffect, useState } from "react";
import axios from "axios";

type Account = {
  username?: string;
  // add other account properties if needed
};

function ClientDashboard() {
  type Order = {
    _id: string;
    status: string;
    total: number;
    // add other order properties if needed
  };

  const [orders, setOrders] = useState<Order[]>([]);
  type WishlistItem = {
    _id: string;
    name: string;
    // add other wishlist item properties if needed
  };
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [account, setAccount] = useState<Account>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Replace with your actual endpoints for client data
        const [ordersRes, wishlistRes, accountRes] = await Promise.all([
          axios.get("http://localhost:5000/api_v1/orders/me"),
          axios.get("http://localhost:5000/api_v1/wishlist/me"),
          axios.get("http://localhost:5000/api_v1/user/me"),
        ]);
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        setWishlist(Array.isArray(wishlistRes.data) ? wishlistRes.data : []);
        setAccount(accountRes.data || {});
      } catch (err) {
        // handle error, optionally set error state
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
                  <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
                    {orders.slice(0, 5).map((order) => (
                      <li key={order._id} className='py-2'>
                        <span className='font-bold text-gray-900 dark:text-yellow-100'>
                          #{order._id}
                        </span>{" "}
                        - {order.status} - ${order.total}
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
                    Your wishlist is empty.
                  </div>
                ) : (
                  <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
                    {wishlist.slice(0, 5).map((item) => (
                      <li key={item._id} className='py-2'>
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
