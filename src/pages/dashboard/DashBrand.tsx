import React, { useState, useEffect } from "react";
import axios from "axios";

export default function DashBrand() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editCategory, setEditCategory] = useState({
    name: "",
    tagline: "",
    initial: "",
    bgColor: "",
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    tagline: "",
    initial: "",
    bgColor: "",
  });

  // Helper to get access token from localStorage or cookies
  const getToken = () => {
    // Try localStorage first
    const local = localStorage.getItem("accessToken");
    if (local) return local;
    // Fallback to cookies
    const match = document.cookie.match(/accessToken=([^;]+)/);
    return match ? match[1] : "";
  };

  // Fetch brand categories
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api_v1/brand-categories")
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch brand categories");
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

  // Add new brand category
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };
  const handleNewSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api_v1/brand-categories", newCategory, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then((res) => {
        setCategories((prev) => [...prev, res.data]);
        setNewCategory({ name: "", tagline: "", initial: "", bgColor: "" });
      })
      .catch(() => setError("Failed to add brand category (admin only)"));
  };

  // Edit brand category
  const handleEdit = (cat) => {
    if (!cat._id) {
      setError("Invalid category: missing _id");
      return;
    }
    setEditId(cat._id);
    setEditCategory({
      name: cat.name,
      tagline: cat.tagline,
      initial: cat.initial,
      bgColor: cat.bgColor,
    });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCategory((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setError("You must be signed in as admin to update categories.");
      return;
    }
    try {
      const res = await axios.patch(
        `http://localhost:5000/api_v1/brand-categories/${editId}`,
        editCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories((prev) =>
        prev.map((c) => (c._id === editId ? res.data : c))
      );
      setEditId(null);
      setEditCategory({ name: "", tagline: "", initial: "", bgColor: "" });
      setError(""); // clear error on success
    } catch (err) {
      let msg = "Failed to update brand category";
      if (err.response && err.response.data && err.response.data.message) {
        msg += `: ${err.response.data.message}`;
      }
      setError(msg);
    }
  };

  // Delete brand category
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api_v1/brand-categories/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .then(() => {
        setCategories((prev) => prev.filter((c) => c._id !== id));
      })
      .catch(() => setError("Failed to delete brand category (admin only)"));
  };

  return (
    <div className='p-6 bg-white dark:bg-gray-900 min-h-screen'>
      <h2 className='text-xl font-bold mb-4 text-gray-900 dark:text-yellow-100'>
        Brand Categories
      </h2>
      {/* Add new brand category */}
      <form
        className='flex flex-col sm:flex-row gap-2 mb-6 w-full sm:flex-wrap'
        onSubmit={handleNewSubmit}
      >
        <input
          name='name'
          value={newCategory.name}
          onChange={handleNewChange}
          placeholder='Name'
          className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
          required
        />
        <input
          name='tagline'
          value={newCategory.tagline}
          onChange={handleNewChange}
          placeholder='Tagline'
          className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
        />
        <input
          name='initial'
          value={newCategory.initial}
          onChange={handleNewChange}
          placeholder='Initial'
          className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
        />
        <input
          name='bgColor'
          value={newCategory.bgColor}
          onChange={handleNewChange}
          placeholder='Bg Color'
          className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
        />
        <button
          type='submit'
          className='p-2 px-12 bg-yellow-500 text-white rounded w-full sm:w-auto'
        >
          Add
        </button>
      </form>
      {error && <div className='text-red-500 mb-2'>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className='w-full overflow-x-auto sm:rounded-lg shadow-md'>
          <table className='min-w-[500px] w-full text-sm text-left rtl:text-right text-gray-800 dark:text-yellow-100'>
            <thead className='text-xs uppercase bg-gray-100 dark:bg-gray-800 dark:text-yellow-100'>
              <tr>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Name</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Tagline</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Initial</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Bg Color</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) =>
                editId === cat._id ? (
                  <tr key={cat._id}>
                    <td colSpan={5} className='px-6 py-4'>
                      <form
                        className='flex gap-2 items-center'
                        onSubmit={handleEditSubmit}
                      >
                        <input
                          name='name'
                          value={editCategory.name}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          required
                        />
                        <input
                          name='tagline'
                          value={editCategory.tagline}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                        />
                        <input
                          name='initial'
                          value={editCategory.initial}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                        />
                        <input
                          name='bgColor'
                          value={editCategory.bgColor}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                        />
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
                  <tr key={cat._id}>
                    <td className='px-6 py-4'>{cat.name}</td>
                    <td className='px-6 py-4'>{cat.tagline}</td>
                    <td className='px-6 py-4'>{cat.initial}</td>
                    <td className='px-6 py-4'>{cat.bgColor}</td>
                    <td className='px-6 py-4 flex gap-2'>
                      <button
                        className='font-medium text-blue-600 dark:text-blue-400 hover:underline'
                        onClick={() => handleEdit(cat)}
                      >
                        Edit
                      </button>
                      <button
                        className='font-medium text-red-600 dark:text-red-400 hover:underline'
                        onClick={() => handleDelete(cat._id)}
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
