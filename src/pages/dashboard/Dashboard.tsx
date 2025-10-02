import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Helper to get access token from localStorage or cookies
const getToken = () => {
  const local = localStorage.getItem("accessToken");
  if (local) return local;
  const match = document.cookie.match(/accessToken=([^;]+)/);
  return match ? match[1] : "";
};

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const token = getToken();
        const [productsRes, usersRes, brandsRes, servicesRes] =
          await Promise.all([
            axios.get(
              `https://kapee-ecommerce-backend.onrender.com/api_v1/products`
            ),
            // Customers route is protected: requireSignin, isAdmin
            token
              ? axios.get(
                  `https://kapee-ecommerce-backend.onrender.com/api_v1/user/users`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                )
              : Promise.resolve({ data: [] }),
            axios.get(
              `https://kapee-ecommerce-backend.onrender.com/api_v1/brand-categories`
            ),
            axios.get(
              `https://kapee-ecommerce-backend.onrender.com/api_v1/services`
            ),
          ]);
        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
        // If response is { users: [...] }, extract users array
        if (usersRes.data && Array.isArray(usersRes.data.users)) {
          setUsers(usersRes.data.users);
        } else if (Array.isArray(usersRes.data)) {
          setUsers(usersRes.data);
        } else {
          setUsers([]);
        }
        setBrands(Array.isArray(brandsRes.data) ? brandsRes.data : []);
        setServices(Array.isArray(servicesRes.data) ? servicesRes.data : []);
      } catch (err) {
        setError("Failed to fetch dashboard data");
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

  // Only count non-admin users (customers)
  const customerCount = Array.isArray(users)
    ? users.filter((u) => u.userRole !== "admin" && u._id && u.username).length
    : 0;

  // Products per brand category (bar chart)
  const brandCategoryCounts = brands.reduce((acc, brand) => {
    acc[brand.name] = products.filter((p) => p.category === brand._id).length;
    return acc;
  }, {});
  const categoryData = Object.entries(brandCategoryCounts).map(
    ([name, value]) => ({ name, value })
  );

  // Stock status (pie chart)
  const inStock = products.filter((p) => p.inStock).length;
  const outOfStock = products.length - inStock;
  const stockData = [
    { name: "In Stock", value: inStock },
    { name: "Out of Stock", value: outOfStock },
  ];

  // Brand and service counts
  const brandCount = brands.length;
  const serviceCount = services.length;

  return (
    <div className='p-6 bg-white dark:bg-gray-900 min-h-screen'>
      <h2 className='text-xl font-bold mb-4 text-gray-900 dark:text-yellow-100'>
        Admin Dashboard
      </h2>
      {error && <div className='text-red-500 mb-2'>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-5 gap-8 mb-8'>
            <div className='bg-yellow-100 dark:bg-yellow-900 rounded p-4 text-center'>
              <div className='text-2xl font-bold text-gray-900 dark:text-yellow-100'>
                {products.length}
              </div>
              <div className='text-sm text-gray-700 dark:text-yellow-100'>
                Products
              </div>
            </div>
            <div className='bg-blue-100 dark:bg-blue-900 rounded p-4 text-center'>
              <div className='text-2xl font-bold text-gray-900 dark:text-yellow-100'>
                {customerCount}
              </div>
              <div className='text-sm text-gray-700 dark:text-yellow-100'>
                Customers
              </div>
            </div>
            <div className='bg-green-100 dark:bg-green-900 rounded p-4 text-center'>
              <div className='text-2xl font-bold text-gray-900 dark:text-yellow-100'>
                {brandCount}
              </div>
              <div className='text-sm text-gray-700 dark:text-yellow-100'>
                Categories
              </div>
            </div>
            <div className='bg-purple-100 dark:bg-purple-900 rounded p-4 text-center'>
              <div className='text-2xl font-bold text-gray-900 dark:text-yellow-100'>
                {serviceCount}
              </div>
              <div className='text-sm text-gray-700 dark:text-yellow-100'>
                Services
              </div>
            </div>
            <div className='bg-pink-100 dark:bg-pink-900 rounded p-4 text-center'>
              <div className='text-2xl font-bold text-gray-900 dark:text-yellow-100'>
                {inStock}
              </div>
              <div className='text-sm text-gray-700 dark:text-yellow-100'>
                Products In Stock
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-32'>
            <div>
              <h3 className='font-semibold mb-2 text-center text-gray-900 dark:text-yellow-100'>
                Products per Category
              </h3>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={categoryData}>
                  <XAxis dataKey='name' stroke='#fbbf24' />
                  <YAxis stroke='#fbbf24' />
                  <Tooltip
                    contentStyle={{
                      background: "#fbbf24",
                      color: "#222",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey='value' fill='#fbbf24' />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className='font-semibold mb-2 text-center text-gray-900 dark:text-yellow-100'>
                Stock Status
              </h3>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={stockData}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    outerRadius={80}
                    label
                  >
                    {stockData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#34d399", "#f87171"][index % 2]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#fbbf24",
                      color: "#222",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
