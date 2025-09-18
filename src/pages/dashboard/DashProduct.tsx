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

  useEffect(() => {
    const darkMode = localStorage.getItem("dashboardDarkMode") === "true";
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
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
    quantity: "",
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    discount: "",
    image: "",
    category: "",
    features: "",
    rating: "",
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
    // Convert features to array, rating/quantity/price/originalPrice/discount to numbers
    const payload = {
      ...newProduct,
      features: newProduct.features
        ? newProduct.features.split(",").map((f) => f.trim())
        : [],
      quantity: Number(newProduct.quantity),
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice),
      discount: Number(newProduct.discount),
      rating: Number(newProduct.rating),
    };
    axios
      .post("http://localhost:5000/api_v1/products", payload)
      .then((res) => {
        setProducts((prev) => [...prev, res.data]);
        setNewProduct({
          quantity: "",
          name: "",
          description: "",
          price: "",
          originalPrice: "",
          discount: "",
          image: "",
          category: "",
          features: "",
          rating: "",
          inStock: true,
        });
      })
      .catch(() => setError("Failed to add product"));
  };

  return (
    <div className='p-6 bg-white dark:bg-gray-900 min-h-screen'>
      <div className='flex flex-col justify-between items-center mb-6'>
        <h2 className='text-xl font-bold mb-4 text-gray-900 dark:text-yellow-100'>
          List of Products
        </h2>
        {/* Add Product Form */}
        <form
          className='flex flex-col sm:flex-row items-center gap-2 sm:w-auto sm:flex-wrap'
          onSubmit={handleNewSubmit}
        >
          <input
            name='name'
            value={newProduct.name}
            onChange={handleNewChange}
            placeholder='Name'
            className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
            required
          />
          <input
            name='description'
            value={newProduct.description}
            onChange={handleNewChange}
            placeholder='Description'
            className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
            required
          />
          <input
            name='image'
            value={newProduct.image}
            onChange={handleNewChange}
            placeholder='Image URL'
            className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
            required
          />
          <input
            name='quantity'
            value={newProduct.quantity}
            onChange={handleNewChange}
            placeholder='Quantity'
            className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
            required
            type='number'
            min='0'
          />
          <input
            name='price'
            value={newProduct.price}
            onChange={handleNewChange}
            placeholder='Price'
            className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
            required
            type='number'
            min='0'
          />
          <input
            name='originalPrice'
            value={newProduct.originalPrice}
            onChange={handleNewChange}
            placeholder='Original Price'
            className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
            type='number'
            min='0'
          />
          <input
            name='discount'
            value={newProduct.discount}
            onChange={handleNewChange}
            placeholder='Discount'
            className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
            type='number'
            min='0'
          />
          <input
            name='rating'
            value={newProduct.rating}
            onChange={handleNewChange}
            placeholder='Rating'
            className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100 min-w-40'
            type='number'
            min='0'
            max='5'
            step='0.1'
          />
          <input
            name='features'
            value={newProduct.features}
            onChange={handleNewChange}
            placeholder='Features (comma separated)'
            className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
          />
          <select
            name='category'
            value={newProduct.category}
            onChange={handleNewChange}
            className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
            required
          >
            <option value=''>Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <label className='flex items-center gap-1 w-full sm:w-auto text-gray-900 dark:text-yellow-100'>
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
            className='p-2 px-12 bg-yellow-500 text-white rounded w-full sm:w-auto'
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
          <table className='min-w-[600px] w-full text-sm text-left rtl:text-right text-gray-800 dark:text-yellow-100'>
            <thead className='text-xs uppercase bg-gray-100 dark:bg-gray-800 dark:text-yellow-100'>
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
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          required
                        />
                        <select
                          name='category'
                          value={editProduct.category}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
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
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          required
                          type='number'
                        />
                        <label className='flex items-center gap-1 text-gray-900 dark:text-yellow-100'>
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
                          className='p-2 bg-gray-300 dark:bg-gray-700 rounded'
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
                    <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-yellow-100'>
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
                        className='font-medium text-blue-600 dark:text-blue-400 hover:underline'
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className='font-medium text-red-600 dark:text-red-400 hover:underline'
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
