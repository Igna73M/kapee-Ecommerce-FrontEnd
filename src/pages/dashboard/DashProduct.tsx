import React from "react";

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

function DashProduct() {
  return (
    <div className='p-6'>
      <h2 className='text-xl font-bold mb-4'>Products In Stock</h2>
      <table className='min-w-full border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='p-2 border'>Name</th>
            <th className='p-2 border'>Category</th>
            <th className='p-2 border'>Price</th>
            <th className='p-2 border'>Stock</th>
          </tr>
        </thead>
        <tbody>
          {dummyProducts.map((product) => (
            <tr
              key={product.id}
              className={product.stock === 0 ? "bg-red-50" : ""}
            >
              <td className='p-2 border'>{product.name}</td>
              <td className='p-2 border'>{product.category}</td>
              <td className='p-2 border'>${product.price}</td>
              <td className='p-2 border'>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DashProduct;
