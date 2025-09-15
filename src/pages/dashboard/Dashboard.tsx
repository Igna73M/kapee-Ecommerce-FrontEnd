import { useEffect, useState } from "react";
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

const dummyProducts = [
  {
    id: "1",
    name: "Smartphone",
    category: "Electronics",
    price: 299,
    stock: 12,
  },
  {
    id: "2",
    name: "Headphones",
    category: "Electronics",
    price: 59,
    stock: 30,
  },
  { id: "3", name: "Watch", category: "Accessories", price: 99, stock: 0 },
  { id: "4", name: "Shoes", category: "Fashion", price: 49, stock: 20 },
];
const dummyUsers = [
  {
    id: "u1",
    username: "john_doe",
    email: "john@example.com",
    joined: "2024-02-10",
  },
  {
    id: "u2",
    username: "jane_smith",
    email: "jane@example.com",
    joined: "2024-03-15",
  },
  {
    id: "u3",
    username: "adminuser",
    email: "admin@kapee.com",
    joined: "2024-01-01",
  },
];

const categoryData = [
  {
    name: "Electronics",
    value: dummyProducts.filter((p) => p.category === "Electronics").length,
  },
  {
    name: "Accessories",
    value: dummyProducts.filter((p) => p.category === "Accessories").length,
  },
  {
    name: "Fashion",
    value: dummyProducts.filter((p) => p.category === "Fashion").length,
  },
];
const stockData = [
  { name: "In Stock", value: dummyProducts.filter((p) => p.stock > 0).length },
  {
    name: "Out of Stock",
    value: dummyProducts.filter((p) => p.stock === 0).length,
  },
];

function Dashboard() {
  return (
    <div className='p-6'>
      <h2 className='text-xl font-bold mb-4'>Admin Dashboard</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
        <div className='bg-yellow-100 rounded p-4 text-center'>
          <div className='text-2xl font-bold'>{dummyProducts.length}</div>
          <div className='text-sm'>Products</div>
        </div>
        <div className='bg-blue-100 rounded p-4 text-center'>
          <div className='text-2xl font-bold'>{dummyUsers.length}</div>
          <div className='text-sm'>Users</div>
        </div>
        <div className='bg-green-100 rounded p-4 text-center'>
          <div className='text-2xl font-bold'>{stockData[0].value}</div>
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
