import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

// Helper to get access token from localStorage or cookies
const getToken = () => {
  const local = localStorage.getItem("accessToken");
  if (local) return local;
  const match = document.cookie.match(/accessToken=([^;]+)/);
  return match ? match[1] : "";
};

function DashBanner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editBanner, setEditBanner] = useState({
    title: "",
    subtitle: "",
    image: "",
    discount: "",
    buttonText: "",
  });
  const [newBanner, setNewBanner] = useState({
    title: "",
    subtitle: "",
    image: "",
    discount: "",
    buttonText: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  // Fetch banners (public)
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api_v1/banners")
      .then((res) => {
        setBanners(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch banners");
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

  // Add new banner (protected, multipart/form-data)
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewBanner((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  const handleNewSubmit = (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setError("You must be signed in as admin to add banners.");
      return;
    }
    if (!imageFile) {
      setError("Image file is required.");
      return;
    }
    const formData = new FormData();
    formData.append("title", newBanner.title);
    formData.append("subtitle", newBanner.subtitle);
    formData.append("discount", newBanner.discount);
    formData.append("buttonText", newBanner.buttonText);
    formData.append("image", imageFile);

    axios
      .post("http://localhost:5000/api_v1/banners", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setBanners((prev) => [...prev, res.data]);
        setNewBanner({
          title: "",
          subtitle: "",
          image: "",
          discount: "",
          buttonText: "",
        });
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setError("");
      })
      .catch((err) => {
        let msg = "Failed to add banner";
        if (err.response && err.response.data && err.response.data.message) {
          msg += `: ${err.response.data.message}`;
        }
        setError(msg);
      });
  };

  // Edit banner (protected, multipart/form-data for image)
  const handleEdit = (banner) => {
    setEditId(banner._id);
    setEditBanner({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      discount: banner.discount,
      buttonText: banner.buttonText,
    });
    setEditImageFile(null);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditBanner((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditImageFile(e.target.files[0]);
    }
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setError("You must be signed in as admin to update banners.");
      return;
    }
    const formData = new FormData();
    formData.append("title", editBanner.title);
    formData.append("subtitle", editBanner.subtitle);
    formData.append("discount", editBanner.discount);
    formData.append("buttonText", editBanner.buttonText);
    if (editImageFile) {
      formData.append("image", editImageFile);
    }
    axios
      .patch(`http://localhost:5000/api_v1/banners/${editId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setBanners((prev) =>
          prev.map((b) => (b._id === editId ? res.data : b))
        );
        setEditId(null);
        setEditBanner({
          title: "",
          subtitle: "",
          image: "",
          discount: "",
          buttonText: "",
        });
        setEditImageFile(null);
        if (editFileInputRef.current) editFileInputRef.current.value = "";
        setError("");
      })
      .catch((err) => {
        let msg = "Failed to update banner";
        if (err.response && err.response.data && err.response.data.message) {
          msg += `: ${err.response.data.message}`;
        }
        setError(msg);
      });
  };

  // Delete banner (protected)
  const handleDelete = (id) => {
    const token = getToken();
    if (!token) {
      setError("You must be signed in as admin to delete banners.");
      return;
    }
    axios
      .delete(`http://localhost:5000/api_v1/banners/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setBanners((prev) => prev.filter((b) => b._id !== id));
        setError("");
      })
      .catch((err) => {
        let msg = "Failed to delete banner";
        if (err.response && err.response.data && err.response.data.message) {
          msg += `: ${err.response.data.message}`;
        }
        setError(msg);
      });
  };

  return (
    <div className='p-6 bg-white dark:bg-gray-900 min-h-screen'>
      <h2 className='text-xl font-bold mb-4 text-gray-900 dark:text-yellow-100'>
        Banners
      </h2>
      {/* Add new banner */}
      <form
        className='flex flex-col sm:flex-row gap-2 mb-6 w-full sm:flex-wrap'
        onSubmit={handleNewSubmit}
        encType='multipart/form-data'
      >
        <input
          name='title'
          value={newBanner.title}
          onChange={handleNewChange}
          placeholder='Title'
          className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
          required
        />
        <input
          name='subtitle'
          value={newBanner.subtitle}
          onChange={handleNewChange}
          placeholder='Subtitle'
          className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
        />
        <input
          type='file'
          accept='image/*'
          ref={fileInputRef}
          onChange={handleImageChange}
          className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
          required
        />
        <input
          name='discount'
          value={newBanner.discount}
          onChange={handleNewChange}
          placeholder='Discount'
          className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
        />
        <input
          name='buttonText'
          value={newBanner.buttonText}
          onChange={handleNewChange}
          placeholder='Button Text'
          className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
        />
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
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          >
            Remove
          </button>
        </div>
      )}
      {error && <div className='text-red-500 mb-2'>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className='w-full overflow-x-auto sm:rounded-lg shadow-md'>
          <table className='min-w-[500px] w-full text-sm text-left rtl:text-right text-gray-800 dark:text-yellow-100'>
            <thead className='text-xs uppercase bg-gray-100 dark:bg-gray-800 dark:text-yellow-100'>
              <tr>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Title</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Subtitle</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Image</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Discount</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Button Text</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Action</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) =>
                editId === banner._id ? (
                  <tr key={banner._id}>
                    <td colSpan={6} className='px-6 py-4'>
                      <form
                        className='flex gap-2 items-center'
                        onSubmit={handleEditSubmit}
                        encType='multipart/form-data'
                      >
                        <input
                          name='title'
                          value={editBanner.title}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          required
                        />
                        <input
                          name='subtitle'
                          value={editBanner.subtitle}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                        />
                        <input
                          type='file'
                          accept='image/*'
                          ref={editFileInputRef}
                          onChange={handleEditImageChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                        />
                        <input
                          name='discount'
                          value={editBanner.discount}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                        />
                        <input
                          name='buttonText'
                          value={editBanner.buttonText}
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
                      {editImageFile && (
                        <div className='text-xs text-gray-600 dark:text-yellow-100 mt-1'>
                          Selected file: {editImageFile.name}
                          <button
                            type='button'
                            className='ml-2 text-red-500 underline'
                            onClick={() => {
                              setEditImageFile(null);
                              if (editFileInputRef.current)
                                editFileInputRef.current.value = "";
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  <tr key={banner._id}>
                    <td className='px-6 py-4'>{banner.title}</td>
                    <td className='px-6 py-4'>{banner.subtitle}</td>
                    <td className='px-6 py-4'>
                      {banner.image ? (
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className='h-12 w-12 object-cover rounded'
                        />
                      ) : (
                        <span className='italic text-gray-400'>No image</span>
                      )}
                    </td>
                    <td className='px-6 py-4'>{banner.discount}</td>
                    <td className='px-6 py-4'>{banner.buttonText}</td>
                    <td className='px-6 py-4 flex gap-2'>
                      <button
                        className='font-medium text-blue-600 dark:text-blue-400 hover:underline'
                        onClick={() => handleEdit(banner)}
                      >
                        Edit
                      </button>
                      <button
                        className='font-medium text-red-600 dark:text-red-400 hover:underline'
                        onClick={() => handleDelete(banner._id)}
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

export default DashBanner;
