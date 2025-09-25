import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";
import Notiflix from "notiflix";

// Helper to get access token from localStorage or cookies
const getToken = () => {
  const local = localStorage.getItem("accessToken");
  if (local) return local;
  const match = document.cookie.match(/accessToken=([^;]+)/);
  return match ? match[1] : "";
};

function DashBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editId, setEditId] = useState(null);
  const [editPost, setEditPost] = useState({
    title: "",
    excerpt: "",
    image: "",
    date: "",
    body: "",
  });
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    image: "",
    date: "",
    body: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch blog posts (public)
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api_v1/blog-posts")
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch blog posts");
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

  // Add new post (protected, multipart/form-data)
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };
  const handleQuillChange = (value) => {
    setNewPost((prev) => ({ ...prev, excerpt: value }));
  };
  const handleBodyChange = (value) => {
    setNewPost((prev) => ({ ...prev, body: value }));
  };
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setImageFile(acceptedFiles[0]);
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const validateForm = () => {
    if (!newPost.title.trim()) return "Title is required.";
    if (!newPost.excerpt.trim()) return "Excerpt is required.";
    if (!newPost.body.trim()) return "Body is required.";
    if (!newPost.date.trim()) return "Date is required.";
    if (!imageFile) return "Image file is required.";
    return "";
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      Notiflix.Notify.failure(validationError);
      return;
    }
    const token = getToken();
    if (!token) {
      setError("You must be signed in as admin to add blog posts.");
      Notiflix.Notify.failure(
        "You must be signed in as admin to add blog posts."
      );
      return;
    }
    // Prepare multipart/form-data
    const formData = new FormData();
    formData.append("title", newPost.title);
    formData.append("excerpt", newPost.excerpt);
    formData.append("date", newPost.date);
    formData.append("body", newPost.body);
    formData.append("image", imageFile);

    try {
      const res = await axios.post(
        "http://localhost:5000/api_v1/blog-posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts((prev) => [...prev, res.data]);
      setNewPost({ title: "", excerpt: "", image: "", date: "", body: "" });
      setImageFile(null);
      setShowModal(false);
      setError("");
      setSuccess("Blog post created successfully!");
      Notiflix.Notify.success("Blog post created successfully!");
    } catch (err) {
      let msg = "Failed to add blog post";
      if (err.response && err.response.data && err.response.data.message) {
        msg += `: ${err.response.data.message}`;
      }
      setError(msg);
      Notiflix.Notify.failure(msg);
    }
  };

  // Edit post (protected, multipart/form-data for image)
  const handleEdit = (post) => {
    setEditId(post._id);
    setEditPost({
      title: post.title,
      excerpt: post.excerpt,
      image: post.image,
      date: post.date,
      body: post.body,
    });
    setShowEditModal(true);
    setError("");
    setSuccess("");
    setImageFile(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditPost((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditExcerptChange = (value) => {
    setEditPost((prev) => ({ ...prev, excerpt: value }));
  };
  const handleEditBodyChange = (value) => {
    setEditPost((prev) => ({ ...prev, body: value }));
  };
  const handleEditImageDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setImageFile(acceptedFiles[0]);
    }
  };
  const {
    getRootProps: getEditRootProps,
    getInputProps: getEditInputProps,
    isDragActive: isEditDragActive,
  } = useDropzone({
    onDrop: handleEditImageDrop,
    accept: { "image/*": [] },
  });

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setError("You must be signed in as admin to update blog posts.");
      Notiflix.Notify.failure(
        "You must be signed in as admin to update blog posts."
      );
      return;
    }
    // Prepare multipart/form-data
    const formData = new FormData();
    formData.append("title", editPost.title);
    formData.append("excerpt", editPost.excerpt);
    formData.append("date", editPost.date);
    formData.append("body", editPost.body);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    try {
      const res = await axios.patch(
        `http://localhost:5000/api_v1/blog-posts/${editId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPosts((prev) => prev.map((p) => (p._id === editId ? res.data : p)));
      setEditId(null);
      setEditPost({ title: "", excerpt: "", image: "", date: "", body: "" });
      setShowEditModal(false);
      setImageFile(null);
      setError("");
      setSuccess("Blog post updated successfully!");
      Notiflix.Notify.success("Blog post updated successfully!");
    } catch (err) {
      let msg = "Failed to update blog post";
      if (err.response && err.response.data && err.response.data.message) {
        msg += `: ${err.response.data.message}`;
      }
      setError(msg);
      Notiflix.Notify.failure(msg);
    }
  };

  // Delete post (protected)
  const handleDelete = (id) => {
    const token = getToken();
    if (!token) {
      setError("You must be signed in as admin to delete blog posts.");
      Notiflix.Notify.failure(
        "You must be signed in as admin to delete blog posts."
      );
      return;
    }
    axios
      .delete(`http://localhost:5000/api_v1/blog-posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setPosts((prev) => prev.filter((p) => p._id !== id));
        setError("");
        Notiflix.Notify.success("Blog post deleted successfully!");
      })
      .catch((err) => {
        let msg = "Failed to delete blog post";
        if (err.response && err.response.data && err.response.data.message) {
          msg += `: ${err.response.data.message}`;
        }
        setError(msg);
        Notiflix.Notify.failure(msg);
      });
  };

  return (
    <div className='p-6 bg-white dark:bg-gray-900 min-h-screen'>
      <h2 className='text-xl font-bold mb-4 text-gray-900 dark:text-yellow-100'>
        Blog Posts
      </h2>
      <button
        className='mb-4 px-4 py-2 bg-yellow-600 text-white rounded shadow hover:bg-yellow-700 transition'
        onClick={() => setShowModal(true)}
      >
        Create New Blog Post
      </button>
      {/* Modal for new blog post */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-lg relative'>
            <button
              className='absolute top-2 right-2 text-gray-500 dark:text-yellow-100 hover:text-gray-700 dark:hover:text-yellow-400'
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h3 className='text-lg font-semibold mb-4 text-gray-900 dark:text-yellow-100'>
              Create Blog Post
            </h3>
            <form
              onSubmit={handleNewSubmit}
              className='flex flex-col gap-4'
              encType='multipart/form-data'
            >
              <input
                name='title'
                value={newPost.title}
                onChange={handleNewChange}
                placeholder='Title'
                className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                required
              />
              <ReactQuill
                value={newPost.excerpt}
                onChange={handleQuillChange}
                placeholder='Excerpt'
                className='bg-white dark:bg-gray-800 rounded text-gray-900 dark:text-yellow-100'
              />
              <ReactQuill
                value={newPost.body}
                onChange={handleBodyChange}
                placeholder='Body'
                className='bg-white dark:bg-gray-800 rounded text-gray-900 dark:text-yellow-100'
              />
              {/* Drag & drop image only */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded p-4 text-center cursor-pointer ${
                  isDragActive
                    ? "border-yellow-600"
                    : "border-gray-300 dark:border-gray-700"
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100`}
              >
                <input {...getInputProps()} />
                {imageFile ? (
                  <span>{imageFile.name}</span>
                ) : (
                  <span>Drag & drop image here, or click to select</span>
                )}
              </div>
              <input
                name='date'
                value={newPost.date}
                onChange={handleNewChange}
                placeholder='Date'
                className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                required
              />
              {error && <div className='text-red-500'>{error}</div>}
              {success && <div className='text-green-600'>{success}</div>}
              <button
                type='submit'
                className='p-2 bg-yellow-500 text-white rounded'
              >
                Add Blog Post
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal for editing blog post */}
      {showEditModal && (
        <div className='fixed inset-0 z-50 flex items-start justify-center bg-black/30 backdrop-blur-sm'>
          <div className='relative w-full max-w-2xl sm:max-w-3xl mt-8 mx-2 sm:mx-6 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700'>
            {/* Sticky header with close button */}
            <div className='sticky top-0 bg-white dark:bg-gray-900 rounded-t-lg z-10 flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
              <h3 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-yellow-100 text-center w-full'>
                Edit Blog Post
              </h3>
              <button
                className='absolute right-4 top-3 text-gray-500 dark:text-yellow-100 hover:text-gray-700 dark:hover:text-yellow-400 text-2xl'
                onClick={() => {
                  setShowEditModal(false);
                  setEditId(null);
                }}
                aria-label='Close edit modal'
              >
                &times;
              </button>
            </div>
            {/* Scrollable form */}
            <form
              onSubmit={handleEditSubmit}
              className='flex flex-col gap-8 px-4 sm:px-8 py-6 overflow-y-auto'
              style={{ maxHeight: "80vh" }}
              encType='multipart/form-data'
            >
              <div>
                <label
                  htmlFor='title'
                  className='block mb-2 font-semibold text-gray-700 dark:text-yellow-100'
                >
                  Title
                </label>
                <input
                  id='title'
                  name='title'
                  value={editPost.title}
                  onChange={handleEditChange}
                  placeholder='Title'
                  className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100 w-full'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='header'
                  className='block mb-2 font-semibold text-gray-700 dark:text-yellow-100'
                >
                  Header
                </label>
                <div className='border rounded bg-white dark:bg-gray-800 h-32 sm:h-40 mb-2'>
                  <ReactQuill
                    id='header'
                    value={editPost.excerpt}
                    onChange={handleEditExcerptChange}
                    placeholder='Header'
                    className='h-full'
                  />
                </div>
              </div>
              <div className='h-64'></div>
              <div className='mt-6'>
                <label className='block mb-2 font-semibold text-gray-700 dark:text-yellow-100'>
                  Body
                </label>
                <div className='border rounded bg-white dark:bg-gray-800 h-40 sm:h-60 mb-2'>
                  <ReactQuill
                    value={editPost.body}
                    onChange={handleEditBodyChange}
                    placeholder='Body'
                    className='h-full'
                  />
                </div>
              </div>
              <div className='h-64'></div>
              <div className='mt-6'>
                <label
                  htmlFor='image'
                  className='block mb-2 font-semibold text-gray-700 dark:text-yellow-100'
                >
                  Image
                </label>
                <div
                  {...getEditRootProps()}
                  className={`border-2 border-dashed rounded p-4 text-center cursor-pointer ${
                    isEditDragActive
                      ? "border-yellow-600"
                      : "border-gray-300 dark:border-gray-700"
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100 mb-2`}
                >
                  <input {...getEditInputProps()} />
                  {imageFile ? (
                    <span>{imageFile.name}</span>
                  ) : (
                    <span>Drag & drop new image here, or click to select</span>
                  )}
                </div>
                <input
                  name='image'
                  id='image'
                  value={editPost.image}
                  onChange={handleEditChange}
                  placeholder='Current image link (read-only)'
                  className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100 w-full mb-2'
                  readOnly
                />
              </div>
              <div>
                <label className='block mb-2 font-semibold text-gray-700 dark:text-yellow-100'>
                  Date
                </label>
                <input
                  name='date'
                  value={editPost.date}
                  onChange={handleEditChange}
                  placeholder='Date'
                  className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100 w-full mb-2'
                  required
                />
              </div>
              {error && <div className='text-red-500'>{error}</div>}
              {success && <div className='text-green-600'>{success}</div>}
              <div className='flex flex-col sm:flex-row gap-2 justify-end mt-2'>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-700 transition font-semibold w-full sm:w-auto'
                >
                  Save
                </button>
                <button
                  type='button'
                  className='px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded font-semibold text-gray-900 dark:text-yellow-100 w-full sm:w-auto'
                  onClick={() => {
                    setShowEditModal(false);
                    setEditId(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className='w-full overflow-x-auto sm:rounded-lg shadow-md'>
          <table className='min-w-[500px] w-full text-sm text-left rtl:text-right text-gray-800 dark:text-yellow-100'>
            <thead className='text-xs uppercase bg-gray-100 dark:bg-gray-800 dark:text-yellow-100'>
              <tr>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Title</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Excerpt</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Image</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Date</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <td className='px-6 py-4'>{post.title}</td>
                  <td className='px-6 py-4'>
                    <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                  </td>
                  <td className='px-6 py-4'>
                    {post.image ? (
                      <img
                        src={post.image}
                        alt='blog'
                        className='h-12 w-12 object-cover rounded'
                      />
                    ) : (
                      ""
                    )}
                  </td>
                  <td className='px-6 py-4'>{post.date}</td>
                  <td className='px-6 py-4 flex gap-2'>
                    <button
                      className='font-medium text-blue-600 dark:text-blue-400 hover:underline'
                      onClick={() => handleEdit(post)}
                    >
                      Edit
                    </button>
                    <button
                      className='font-medium text-red-600 dark:text-red-400 hover:underline'
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashBlog;
