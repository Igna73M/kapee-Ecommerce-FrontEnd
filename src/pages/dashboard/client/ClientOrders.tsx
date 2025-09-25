import React, { useEffect, useState } from "react";
import axios from "axios";

// --- DUMMY DATA FOR DEVELOPMENT ---
const dummyProducts = [
  {
    id: "p1",
    name: "Wireless Headphones",
    image: "/src/assets/headphones.png",
    price: 99.99,
  },
  {
    id: "p2",
    name: "Smart Watch",
    image: "/src/assets/watch-charger.png",
    price: 149.99,
  },
  {
    id: "p3",
    name: "Bluetooth Speaker",
    image: "/src/assets/wireless-speaker.png",
    price: 59.99,
  },
];

const dummyOrders = [
  {
    _id: "order1",
    createdAt: "2025-09-20T10:00:00Z",
    status: "delivered",
    total: 249.98,
    items: [
      { product: { id: "p1" }, quantity: 2 },
      { product: { id: "p3" }, quantity: 1 },
    ],
  },
  {
    _id: "order2",
    createdAt: "2025-09-22T15:30:00Z",
    status: "processing",
    total: 149.99,
    items: [{ product: { id: "p2" }, quantity: 1 }],
  },
];
// --- END DUMMY DATA ---

type Product = {
  id?: string;
  _id?: string;
  name?: string;
  image?: string;
  price?: number;
};

type OrderItem = {
  product: Product;
  quantity: number;
};

type Order = {
  _id: string;
  createdAt: string;
  status: string;
  total: number;
  items: OrderItem[];
};

function ClientOrders({ products = dummyProducts }: { products?: Product[] }) {
  const [orders, setOrders] = useState<Order[]>(dummyOrders);
  const [loading, setLoading] = useState(false);

  // Uncomment this block to use real API instead of dummy data
  /*
  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:5000/api_v1/orders/me", {
  // Helper to get product info from global list
  const getProduct = (id: string) =>
    products.find((p) => p.id === id || p._id === id);
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setOrders([]);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);
  */

  useEffect(() => {
    const darkMode = localStorage.getItem("dashboardDarkMode") === "true";
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  // Helper to get product info from global list
  const getProduct = (id) => products.find((p) => p.id === id || p._id === id);

  return (
    <div className='p-6 bg-white dark:bg-gray-900 min-h-screen'>
      <h2 className='text-xl font-bold mb-4 text-gray-900 dark:text-yellow-100'>
        My Orders
      </h2>
      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div className='text-gray-500 dark:text-yellow-100 text-center'>
          You have no orders yet.
        </div>
      ) : (
        <div className='space-y-8'>
          {orders.map((order) => (
            <div
              key={order._id}
              className='bg-gray-50 dark:bg-gray-800 rounded-lg shadow p-4'
            >
              <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-2'>
                <div>
                  <span className='font-bold text-gray-900 dark:text-yellow-100'>
                    Order #{order._id}
                  </span>
                  <span className='ml-4 text-sm text-gray-600 dark:text-yellow-100'>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                <div className='mt-2 md:mt-0'>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === "delivered"
                        ? "bg-green-200 text-green-800"
                        : order.status === "processing"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {order.status || "Pending"}
                  </span>
                </div>
              </div>
              <div className='overflow-x-auto'>
                <table className='min-w-full text-sm text-left text-gray-800 dark:text-yellow-100'>
                  <thead>
                    <tr className='bg-gray-100 dark:bg-gray-700'>
                      <th className='px-4 py-2'>Product</th>
                      <th className='px-4 py-2'>Qty</th>
                      <th className='px-4 py-2'>Price</th>
                      <th className='px-4 py-2'>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((item, idx) => {
                      const prod =
                        getProduct(item.product?.id || item.product?._id) ||
                        item.product ||
                        {};
                      return (
                        <tr key={prod.id || prod._id || idx}>
                          <td className='px-4 py-2 flex items-center gap-2'>
                            {prod.image && (
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className='w-8 h-8 object-cover rounded'
                              />
                            )}
                            <span>{prod.name || "Product"}</span>
                          </td>
                          <td className='px-4 py-2'>{item.quantity}</td>
                          <td className='px-4 py-2'>
                            ${prod.price?.toFixed(2) || "0.00"}
                          </td>
                          <td className='px-4 py-2'>
                            $
                            {((prod.price || 0) * (item.quantity || 0)).toFixed(
                              2
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className='flex justify-end mt-4'>
                <span className='font-bold text-lg text-gray-900 dark:text-yellow-100'>
                  Total: ${order.total?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClientOrders;
