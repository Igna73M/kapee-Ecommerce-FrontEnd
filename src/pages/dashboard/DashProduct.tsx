import React from "react";
import { products } from "../../data/products";

function DashProduct() {
  return (
    <div className='p-6'>
      <h2 className='text-xl font-bold mb-4'>Products In Stock</h2>
      <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <table className='w-full text-sm text-left rtl:text-right text-yellow-700 dark:text-yellow-400'>
          <thead className='text-xs uppercase bg-yellow-50 dark:bg-yellow-700 dark:text-yellow-400'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Product name
              </th>
              {/* Color column removed, not present in Product type */}
              <th scope='col' className='px-6 py-3'>
                Category
              </th>
              <th scope='col' className='px-6 py-3'>
                Price
              </th>
              <th scope='col' className='px-6 py-3'>
                In Stock
              </th>
              <th scope='col' className='px-6 py-3'>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((product, idx) => (
                <tr
                  key={product.id}
                  className={
                    (idx % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800") +
                    " border-b border-gray-200 dark:border-gray-700"
                  }
                >
                  <th
                    scope='row'
                    className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                  >
                    {product.name}
                  </th>
                  {/* Color cell removed, not present in Product type */}
                  <td className='px-6 py-4'>{product.category}</td>
                  <td className='px-6 py-4'>${product.price}</td>
                  <td className='px-6 py-4'>
                    {product.inStock ? "Yes" : "No"}
                  </td>
                  <td className='px-6 py-4'>
                    <a
                      href='#'
                      className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashProduct;
