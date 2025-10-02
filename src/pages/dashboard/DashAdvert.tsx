import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

// Helper to get access token from localStorage or cookies
const getToken = () => {
  const local = localStorage.getItem("accessToken");
  if (local) return local;
  const match = document.cookie.match(/accessToken=([^;]+)/);
  return match ? match[1] : "";
};

function DashAdvert() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editSlide, setEditSlide] = useState({
    title: "",
    subtitle: "",
    highlight: "",
    image: "",
    discount: "",
    buttonText: "",
  });
  const [newSlide, setNewSlide] = useState({
    title: "",
    subtitle: "",
    highlight: "",
    discount: "",
    image: "",
    buttonText: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  // Fetch hero slides
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://kapee-ecommerce-backend.onrender.com/api_v1/hero-slides")
      .then((res) => {
        setSlides(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch hero slides");
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

  // Add new slide (protected, multipart/form-data)
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewSlide((prev) => ({ ...prev, [name]: value }));
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
      setError("You must be signed in as admin to add slides.");
      return;
    }
    if (!imageFile) {
      setError("Image file is required.");
      return;
    }
    const formData = new FormData();
    formData.append("title", newSlide.title);
    formData.append("subtitle", newSlide.subtitle);
    formData.append("highlight", newSlide.highlight);
    formData.append("discount", newSlide.discount);
    formData.append("buttonText", newSlide.buttonText);
    formData.append("image", imageFile);

    axios
      .post(
        "https://kapee-ecommerce-backend.onrender.com/api_v1/hero-slides",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setSlides((prev) => [...prev, res.data]);
        setNewSlide({
          title: "",
          subtitle: "",
          highlight: "",
          image: "",
          discount: "",
          buttonText: "",
        });
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setError("");
      })
      .catch((err) => {
        let msg = "Failed to add hero slide";
        if (err.response && err.response.data && err.response.data.message) {
          msg += `: ${err.response.data.message}`;
        }
        setError(msg);
      });
  };

  // Edit slide (protected, multipart/form-data for image)
  const handleEdit = (slide) => {
    setEditId(slide._id);
    setEditSlide({
      title: slide.title,
      subtitle: slide.subtitle,
      highlight: slide.highlight || "",
      image: slide.image,
      discount: slide.discount,
      buttonText: slide.buttonText,
    });
    setEditImageFile(null);
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditSlide((prev) => ({ ...prev, [name]: value }));
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
      setError("You must be signed in as admin to update slides.");
      return;
    }
    const formData = new FormData();
    formData.append("title", editSlide.title);
    formData.append("subtitle", editSlide.subtitle);
    formData.append("highlight", editSlide.highlight);
    formData.append("discount", editSlide.discount);
    formData.append("buttonText", editSlide.buttonText);
    if (editImageFile) {
      formData.append("image", editImageFile);
    }
    axios
      .patch(
        `https://kapee-ecommerce-backend.onrender.com/api_v1/hero-slides/${editId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setSlides((prev) => prev.map((s) => (s._id === editId ? res.data : s)));
        setEditId(null);
        setEditSlide({
          title: "",
          subtitle: "",
          highlight: "",
          image: "",
          discount: "",
          buttonText: "",
        });
        setEditImageFile(null);
        if (editFileInputRef.current) editFileInputRef.current.value = "";
        setError("");
      })
      .catch((err) => {
        let msg = "Failed to update hero slide";
        if (err.response && err.response.data && err.response.data.message) {
          msg += `: ${err.response.data.message}`;
        }
        setError(msg);
      });
  };

  // Delete slide (protected)
  const handleDelete = (id) => {
    const token = getToken();
    if (!token) {
      setError("You must be signed in as admin to delete slides.");
      return;
    }
    axios
      .delete(
        `https://kapee-ecommerce-backend.onrender.com/api_v1/hero-slides/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setSlides((prev) => prev.filter((s) => s._id !== id));
        setError("");
      })
      .catch((err) => {
        let msg = "Failed to delete hero slide";
        if (err.response && err.response.data && err.response.data.message) {
          msg += `: ${err.response.data.message}`;
        }
        setError(msg);
      });
  };

  return (
    <div className='p-6 bg-white dark:bg-gray-900 min-h-screen'>
      <h2 className='text-xl font-bold mb-4 text-gray-900 dark:text-yellow-100'>
        Advertisement
      </h2>
      {/* Add new slide */}
      <form
        className='flex flex-col sm:flex-row gap-2 mb-6 w-full max-w-2xl sm:flex-wrap'
        onSubmit={handleNewSubmit}
        encType='multipart/form-data'
      >
        <input
          name='title'
          value={newSlide.title}
          onChange={handleNewChange}
          placeholder='Title'
          className='p-2 border rounded flex-1 w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
          required
        />
        <input
          name='subtitle'
          value={newSlide.subtitle}
          onChange={handleNewChange}
          placeholder='Subtitle'
          className='p-2 border rounded flex-1 w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
        />
        <input
          name='highlight'
          value={newSlide.highlight}
          onChange={handleNewChange}
          placeholder='Highlight'
          className='p-2 border rounded flex-1 w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
        />
        <input
          type='file'
          accept='image/*'
          ref={fileInputRef}
          onChange={handleImageChange}
          className='p-2 border rounded flex-1 w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
          required
        />
        <input
          name='discount'
          value={newSlide.discount}
          onChange={handleNewChange}
          placeholder='Discount'
          className='p-2 border rounded flex-1 w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
        />
        <input
          name='buttonText'
          value={newSlide.buttonText}
          onChange={handleNewChange}
          placeholder='Button Text'
          className='p-2 border rounded flex-1 w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
        />
        <button
          type='submit'
          className='p-2 px-12 bg-yellow-500 text-white rounded font-semibold hover:bg-yellow-600 transition-colors w-full sm:w-auto'
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
          <table className='min-w-[700px] w-full text-sm text-left rtl:text-right text-gray-800 dark:text-yellow-100'>
            <thead className='text-xs uppercase bg-gray-100 dark:bg-gray-800 dark:text-yellow-100'>
              <tr>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Title</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Subtitle</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Highlight</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Image</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Discount</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Button Text</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Action</th>
              </tr>
            </thead>
            <tbody>
              {slides.map((slide) =>
                editId === slide._id ? (
                  <tr key={slide._id}>
                    <td colSpan={7} className='px-6 py-4'>
                      <form
                        className='flex gap-2 items-center flex-wrap'
                        onSubmit={handleEditSubmit}
                        encType='multipart/form-data'
                      >
                        <input
                          name='title'
                          value={editSlide.title}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          required
                          placeholder='Title'
                        />
                        <input
                          name='subtitle'
                          value={editSlide.subtitle}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          placeholder='Subtitle'
                        />
                        <input
                          name='highlight'
                          value={editSlide.highlight}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          placeholder='Highlight'
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
                          value={editSlide.discount}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          placeholder='Discount'
                        />
                        <input
                          name='buttonText'
                          value={editSlide.buttonText}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          placeholder='Button Text'
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
                  <tr key={slide._id}>
                    <td className='px-6 py-4'>{slide.title}</td>
                    <td className='px-6 py-4'>{slide.subtitle}</td>
                    <td className='px-6 py-4'>{slide.highlight}</td>
                    <td className='px-6 py-4'>
                      {slide.image ? (
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className='h-12 w-12 object-cover rounded'
                        />
                      ) : (
                        <span className='italic text-gray-400'>No image</span>
                      )}
                    </td>
                    <td className='px-6 py-4'>{slide.discount}</td>
                    <td className='px-6 py-4'>{slide.buttonText}</td>
                    <td>
                      <div className='px-6 py-4 flex gap-2'>
                        <button
                          className='flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500 hover:shadow px-3 py-1 rounded transition-all duration-150'
                          onClick={() => handleEdit(slide)}
                          title='Edit slide'
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
                                "Are you sure you want to delete this slide? This action cannot be undone."
                              )
                            ) {
                              handleDelete(slide._id);
                            }
                          }}
                          title='Delete slide'
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

export default DashAdvert;
