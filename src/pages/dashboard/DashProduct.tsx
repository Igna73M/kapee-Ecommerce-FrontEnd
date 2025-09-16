import React, { useEffect, useState } from "react";
import axios from "axios";

function DashProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editProduct, setEditProduct] = useState({
    name: "",
    category: "",
    price: "",
    inStock: true,
  });

  // Fetch products from backend
  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get("http://localhost:5000/api_v1/products"),
      axios.get("http://localhost:5000/api_v1/brand-categories"),
    ])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch products or categories");
        setLoading(false);
      });
  }, []);

  // Edit product
  const handleEdit = (product) => {
    setEditId(product._id);
    setEditProduct({
      name: product.name,
      category: product.category?._id || product.category, // store category id
      price: product.price,
      inStock: product.inStock,
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .patch(`http://localhost:5000/api_v1/products/${editId}`, editProduct)
      .then((res) => {
        setProducts((prev) =>
          prev.map((p) => (p._id === editId ? res.data : p))
        );
        setEditId(null);
        setEditProduct({ name: "", category: "", price: "", inStock: true });
      })
      .catch(() => setError("Failed to update product"));
  };

  // Delete product
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api_v1/products/${id}`)
      .then(() => {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      })
      .catch(() => setError("Failed to delete product"));
  };

  // Add product
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    inStock: true,
  });
  const handleNewChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleNewSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api_v1/products", newProduct)
      .then((res) => {
        setProducts((prev) => [...prev, res.data]);
        setNewProduct({ name: "", category: "", price: "", inStock: true });
      })
      .catch(() => setError("Failed to add product"));
  };

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-bold mb-4'>List of Products</h2>
        {/* Add Product Form */}
        <form className='flex items-center gap-2' onSubmit={handleNewSubmit}>
          <input
            name='name'
            value={newProduct.name}
            onChange={handleNewChange}
            placeholder='Name'
            className='p-2 border rounded'
            required
          />
          <select
            name='category'
            value={newProduct.category}
            onChange={handleNewChange}
            className='p-2 border rounded'
            required
          >
            <option value=''>Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            name='price'
            value={newProduct.price}
            onChange={handleNewChange}
            placeholder='Price'
            className='p-2 border rounded'
            required
            type='number'
          />
          <label className='flex items-center gap-1'>
            <input
              type='checkbox'
              name='inStock'
              checked={newProduct.inStock}
              onChange={handleNewChange}
            />{" "}
            In Stock
          </label>
          <button
            type='submit'
            className='p-2 bg-yellow-500 text-white rounded'
          >
            Add
          </button>
        </form>
      </div>
      {error && <div className='text-red-500 mb-2'>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className='w-full overflow-x-auto sm:rounded-lg shadow-md'>
          <table className='min-w-[600px] w-full text-sm text-left rtl:text-right text-yellow-700 dark:text-yellow-400'>
            <thead className='text-xs uppercase bg-yellow-50 dark:bg-yellow-700 dark:text-yellow-400'>
              <tr>
                <th scope='col' className='px-4 py-2 sm:px-6 sm:py-3'>
                  Product name
                </th>
                <th scope='col' className='px-4 py-2 sm:px-6 sm:py-3'>
                  Category
                </th>
                <th scope='col' className='px-4 py-2 sm:px-6 sm:py-3'>
                  Price
                </th>
                <th scope='col' className='px-4 py-2 sm:px-6 sm:py-3'>
                  In Stock
                </th>
                <th scope='col' className='px-4 py-2 sm:px-6 sm:py-3'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) =>
                editId === product._id ? (
                  <tr
                    key={product._id}
                    className={
                      (idx % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-gray-50 dark:bg-gray-800") +
                      " border-b border-gray-200 dark:border-gray-700"
                    }
                  >
                    <td className='px-6 py-4' colSpan={5}>
                      <form
                        className='flex gap-2 items-center'
                        onSubmit={handleEditSubmit}
                      >
                        <input
                          name='name'
                          value={editProduct.name}
                          onChange={handleEditChange}
                          className='p-2 border rounded'
                          required
                        />
                        <select
                          name='category'
                          value={editProduct.category}
                          onChange={handleEditChange}
                          className='p-2 border rounded'
                          required
                        >
                          <option value=''>Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <input
                          name='price'
                          value={editProduct.price}
                          onChange={handleEditChange}
                          className='p-2 border rounded'
                          required
                          type='number'
                        />
                        <label className='flex items-center gap-1'>
                          <input
                            type='checkbox'
                            name='inStock'
                            checked={editProduct.inStock}
                            onChange={handleEditChange}
                          />{" "}
                          In Stock
                        </label>
                        <button
                          type='submit'
                          className='p-2 bg-blue-500 text-white rounded'
                        >
                          Save
                        </button>
                        <button
                          type='button'
                          className='p-2 bg-gray-300 rounded'
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </button>
                      </form>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={product._id}
                    className={
                      (idx % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-gray-50 dark:bg-gray-800") +
                      " border-b border-gray-200 dark:border-gray-700"
                    }
                  >
                    <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                      {product.name}
                    </td>
                    <td className='px-6 py-4'>
                      {categories.find(
                        (cat) =>
                          cat._id ===
                          (product.category?._id || product.category)
                      )?.name || ""}
                    </td>
                    <td className='px-6 py-4'>${product.price}</td>
                    <td className='px-6 py-4'>
                      {product.inStock ? "Yes" : "No"}
                    </td>
                    <td className='px-6 py-4 flex gap-2'>
                      <button
                        className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className='font-medium text-red-600 dark:text-red-500 hover:underline'
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashProduct;
