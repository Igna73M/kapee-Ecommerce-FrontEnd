import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

function DashProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editProduct, setEditProduct] = useState({
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
  const [editImageFile, setEditImageFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Helper to get access token from localStorage or cookies
  const getToken = () => {
    const local = localStorage.getItem("accessToken");
    if (local) return local;
    const match = document.cookie.match(/accessToken=([^;]+)/);
    return match ? match[1] : "";
  };

  // Fetch products from backend (public route)
  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`https://kapee-ecommerce-backend.onrender.com/api_v1/products`),
      axios.get(
        `https://kapee-ecommerce-backend.onrender.com/api_v1/brand-categories`
      ),
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
      quantity: product.quantity ?? "",
      name: product.name ?? "",
      description: product.description ?? "",
      price: product.price ?? "",
      originalPrice: product.originalPrice ?? "",
      discount: product.discount ?? "",
      image: product.image ?? "",
      category: product.category?._id || product.category || "",
      features: Array.isArray(product.features)
        ? product.features.join(", ")
        : product.features ?? "",
      rating: product.rating ?? "",
      inStock: product.inStock ?? true,
    });
    setEditImageFile(null);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditImageFile(e.target.files[0]);
      setEditProduct((prev) => ({
        ...prev,
        image: e.target.files[0].name,
      }));
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setError("You must be signed in as admin to update products.");
      return;
    }
    const payload = {
      ...editProduct,
      features: editProduct.features
        ? editProduct.features.split(",").map((f) => f.trim())
        : [],
      quantity: Number(editProduct.quantity),
      price: Number(editProduct.price),
      originalPrice: Number(editProduct.originalPrice),
      discount: Number(editProduct.discount),
      rating: Number(editProduct.rating),
    };
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}[]`, String(v)));
      } else {
        formData.append(key, String(value));
      }
    });
    if (editImageFile) {
      formData.append("image", editImageFile);
    }
    axios
      .patch(
        `https://kapee-ecommerce-backend.onrender.com/api_v1/products/${editId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setProducts((prev) =>
          prev.map((p) => (p._id === editId ? res.data : p))
        );
        setEditId(null);
        setEditProduct({
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
        setEditImageFile(null);
        setError("");
      })
      .catch((err) => {
        let msg = "Failed to update product";
        if (err.response && err.response.data && err.response.data.message) {
          msg += `: ${err.response.data.message}`;
        }
        setError(msg);
      });
  };

  // Delete product (protected)
  const handleDelete = (id) => {
    const token = getToken();
    if (!token) {
      setError("You must be signed in as admin to delete products.");
      return;
    }
    axios
      .delete(
        `https://kapee-ecommerce-backend.onrender.com/api_v1/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setError("");
      })
      .catch((err) => {
        let msg = "Failed to delete product";
        if (err.response && err.response.data && err.response.data.message) {
          msg += `: ${err.response.data.message}`;
        }
        setError(msg);
      });
  };

  // Add product (protected)
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
  const fileInputRef = useRef(null);

  const handleNewChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setNewProduct((prev) => ({
        ...prev,
        image: e.target.files[0].name,
      }));
    }
  };

  const handleNewSubmit = (e) => {
    e.preventDefault();
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

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}[]`, String(v)));
      } else {
        formData.append(key, String(value));
      }
    });
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const token = getToken();
    if (!token) {
      setError("You must be signed in as admin to add products.");
      return;
    }

    axios
      .post(
        `https://kapee-ecommerce-backend.onrender.com/api_v1/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )
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
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setError("");
      })
      .catch((err) => {
        let msg = "Failed to add product";
        if (err.response && err.response.data && err.response.data.message) {
          msg += `: ${err.response.data.message}`;
        }
        setError(msg);
      });
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
          encType='multipart/form-data'
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
            type='file'
            accept='image/*'
            ref={fileInputRef}
            onChange={handleImageChange}
            className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
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
        {imageFile && (
          <div className='text-xs text-gray-600 dark:text-yellow-100 mt-1'>
            Selected file: {imageFile.name}
            <button
              type='button'
              className='ml-2 text-red-500 underline'
              onClick={() => {
                setImageFile(null);
                setNewProduct((prev) => ({ ...prev, image: "" }));
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              Remove
            </button>
          </div>
        )}
      </div>
      {error && <div className='text-red-500 mb-2'>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className='w-full overflow-x-auto sm:rounded-lg shadow-md'>
          <table className='min-w-[900px] w-full text-sm text-left rtl:text-right text-gray-800 dark:text-yellow-100'>
            <thead className='text-xs uppercase bg-gray-100 dark:bg-gray-800 dark:text-yellow-100'>
              <tr>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Name</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Description</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Image</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Quantity</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Price</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Original Price</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Discount</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Rating</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Features</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Category</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>In Stock</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Action</th>
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
                    <td colSpan={12} className='px-6 py-4'>
                      <form
                        className='flex flex-wrap gap-2 items-center'
                        onSubmit={handleEditSubmit}
                        encType='multipart/form-data'
                      >
                        <input
                          name='name'
                          value={editProduct.name}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          required
                          placeholder='Name'
                        />
                        <input
                          name='description'
                          value={editProduct.description}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          required
                          placeholder='Description'
                        />
                        <input
                          type='file'
                          accept='image/*'
                          onChange={handleEditImageChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                        />
                        <input
                          name='quantity'
                          value={editProduct.quantity}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          required
                          type='number'
                          min='0'
                          placeholder='Quantity'
                        />
                        <input
                          name='price'
                          value={editProduct.price}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          required
                          type='number'
                          min='0'
                          placeholder='Price'
                        />
                        <input
                          name='originalPrice'
                          value={editProduct.originalPrice}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          type='number'
                          min='0'
                          placeholder='Original Price'
                        />
                        <input
                          name='discount'
                          value={editProduct.discount}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          type='number'
                          min='0'
                          placeholder='Discount'
                        />
                        <input
                          name='rating'
                          value={editProduct.rating}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100 min-w-40'
                          type='number'
                          min='0'
                          max='5'
                          step='0.1'
                          placeholder='Rating'
                        />
                        <input
                          name='features'
                          value={editProduct.features}
                          onChange={handleEditChange}
                          placeholder='Features (comma separated)'
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
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
                      {editImageFile && (
                        <div className='text-xs text-gray-600 dark:text-yellow-100 mt-1'>
                          Selected file: {editImageFile.name}
                          <button
                            type='button'
                            className='ml-2 text-red-500 underline'
                            onClick={() => {
                              setEditImageFile(null);
                              setEditProduct((prev) => ({
                                ...prev,
                                image: "",
                              }));
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
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
                    <td className='px-4 py-2'>{product.name}</td>
                    <td className='px-4 py-2'>{product.description}</td>
                    <td className='px-4 py-2'>
                      {product.image ? (
                        <img
                          src={
                            product.image.startsWith("http")
                              ? product.image
                              : `/uploads/${product.image}`
                          }
                          alt={product.name}
                          className='w-16 h-16 object-cover rounded'
                        />
                      ) : (
                        <span className='italic text-gray-400'>No image</span>
                      )}
                    </td>
                    <td className='px-4 py-2'>{product.quantity}</td>
                    <td className='px-4 py-2'>${product.price}</td>
                    <td className='px-4 py-2'>${product.originalPrice}</td>
                    <td className='px-4 py-2'>{product.discount}%</td>
                    <td className='px-4 py-2'>{product.rating}</td>
                    <td className='px-4 py-2'>
                      {Array.isArray(product.features)
                        ? product.features.join(", ")
                        : product.features}
                    </td>
                    <td className='px-4 py-2'>
                      {categories.find(
                        (cat) =>
                          cat._id ===
                          (product.category?._id || product.category)
                      )?.name || ""}
                    </td>
                    <td className='px-4 py-2'>
                      {product.inStock ? "Yes" : "No"}
                    </td>
                    <td>
                      <div className='px-6 py-4 w-full h-full flex gap-2 items-center'>
                        <button
                          className='flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500 hover:shadow px-3 py-1 rounded transition-all duration-150'
                          onClick={() => handleEdit(product)}
                          title='Edit product'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-4 w-4'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M11 5h2m-1 0v14m-7-7h14'
                            />
                          </svg>
                          Edit
                        </button>
                        <button
                          className='flex items-center gap-1 font-medium text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-500 hover:shadow px-3 py-1 rounded transition-all duration-150'
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this product? This action cannot be undone."
                              )
                            ) {
                              handleDelete(product._id);
                            }
                          }}
                          title='Delete product'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-4 w-4'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
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
