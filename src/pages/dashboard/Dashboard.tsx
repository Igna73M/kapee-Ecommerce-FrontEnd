import { dummyUsers } from "@/data/dummyUsers";
import { products } from "@/data/products";
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

function Dashboard() {
  // Only count non-admin users
  const nonAdminUsersCount = dummyUsers.filter(
    (u) => u.userRole !== "admin"
  ).length;

  // Products per category (bar chart)
  const categoryCounts = products
    ? products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    : {};
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Stock status (pie chart)
  const inStock = products ? products.filter((p) => p.inStock).length : 0;
  const outOfStock = products ? products.length - inStock : 0;
  const stockData = [
    { name: "In Stock", value: inStock },
    { name: "Out of Stock", value: outOfStock },
  ];

  return (
    <div className='p-6'>
      <h2 className='text-xl font-bold mb-4'>Admin Dashboard</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
        <div className='bg-yellow-100 rounded p-4 text-center'>
          <div className='text-2xl font-bold'>{products.length}</div>
          <div className='text-sm'>Products</div>
        </div>
        <div className='bg-blue-100 rounded p-4 text-center'>
          <div className='text-2xl font-bold'>{nonAdminUsersCount}</div>
          <div className='text-sm'>Users</div>
        </div>
        <div className='bg-green-100 rounded p-4 text-center'>
          <div className='text-2xl font-bold'>{inStock}</div>
          <div className='text-sm'>Products In Stock</div>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div>
          <h3 className='font-semibold mb-2'>Products per Category</h3>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={categoryData}>
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='value' fill='#fbbf24' />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className='font-semibold mb-2'>Stock Status</h3>
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
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
