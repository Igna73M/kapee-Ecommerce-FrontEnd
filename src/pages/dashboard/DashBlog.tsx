import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";
import Notiflix from "notiflix";

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
  });
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    image: "",
    date: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch blog posts
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

  // Add new post
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };
  const handleQuillChange = (value) => {
    setNewPost((prev) => ({ ...prev, excerpt: value }));
  };
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setImageFile(acceptedFiles[0]);
      setNewPost((prev) => ({ ...prev, image: acceptedFiles[0].name }));
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const validateForm = () => {
    if (!newPost.title.trim()) return "Title is required.";
    if (!newPost.excerpt.trim()) return "Content is required.";
    if (!newPost.date.trim()) return "Date is required.";
    if (!imageFile) return "Image is required.";
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
    let imageUrl = "";
    // Simulate image upload (replace with actual upload logic if needed)
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
    }
    const postData = { ...newPost, image: imageUrl };
    try {
      const res = await axios.post(
        "http://localhost:5000/api_v1/blog-posts",
        postData
      );
      setPosts((prev) => [...prev, res.data]);
      setNewPost({ title: "", excerpt: "", image: "", date: "" });
      setImageFile(null);
      setShowModal(false);
      setSuccess("Blog post created successfully!");
      Notiflix.Notify.success("Blog post created successfully!");
    } catch {
      setError("Failed to add blog post");
      Notiflix.Notify.failure("Failed to add blog post");
    }
  };

  // Edit post
  const handleEdit = (post) => {
    setEditId(post._id);
    setEditPost({
      title: post.title,
      excerpt: post.excerpt,
      image: post.image,
      date: post.date,
    });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditPost((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .patch(`http://localhost:5000/api_v1/blog-posts/${editId}`, editPost)
      .then((res) => {
        setPosts((prev) => prev.map((p) => (p._id === editId ? res.data : p)));
        setEditId(null);
        setEditPost({ title: "", excerpt: "", image: "", date: "" });
      })
      .catch(() => setError("Failed to update blog post"));
  };

  // Delete post
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api_v1/blog-posts/${id}`)
      .then(() => {
        setPosts((prev) => prev.filter((p) => p._id !== id));
      })
      .catch(() => setError("Failed to delete blog post"));
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
            <form onSubmit={handleNewSubmit} className='flex flex-col gap-4'>
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
                placeholder='Content'
                className='bg-white dark:bg-gray-800 rounded text-gray-900 dark:text-yellow-100'
              />
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
              {posts.map((post) =>
                editId === post._id ? (
                  <tr key={post._id}>
                    <td colSpan={5} className='px-6 py-4'>
                      <form
                        className='flex gap-2 items-center'
                        onSubmit={handleEditSubmit}
                      >
                        <input
                          name='title'
                          value={editPost.title}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          required
                        />
                        <input
                          name='excerpt'
                          value={editPost.excerpt}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                        />
                        <input
                          name='image'
                          value={editPost.image}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                        />
                        <input
                          name='date'
                          value={editPost.date}
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
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashBlog;
