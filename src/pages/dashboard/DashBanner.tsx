import React, { useEffect, useState } from "react";
import axios from "axios";

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

  // Fetch banners
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

  // Add new banner
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewBanner((prev) => ({ ...prev, [name]: value }));
  };
  const handleNewSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api_v1/banners", newBanner)
      .then((res) => {
        setBanners((prev) => [...prev, res.data]);
        setNewBanner({
          title: "",
          subtitle: "",
          image: "",
          discount: "",
          buttonText: "",
        });
      })
      .catch(() => setError("Failed to add banner"));
  };

  // Edit banner
  const handleEdit = (banner) => {
    setEditId(banner._id);
    setEditBanner({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      discount: banner.discount,
      buttonText: banner.buttonText,
    });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditBanner((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .patch(`http://localhost:5000/api_v1/banners/${editId}`, editBanner)
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
      })
      .catch(() => setError("Failed to update banner"));
  };

  // Delete banner
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api_v1/banners/${id}`)
      .then(() => {
        setBanners((prev) => prev.filter((b) => b._id !== id));
      })
      .catch(() => setError("Failed to delete banner"));
  };

  return (
    <div className='p-6'>
      <h2 className='text-xl font-bold mb-4'>Banners</h2>
      {/* Add new banner */}
      <form className='flex gap-2 mb-6' onSubmit={handleNewSubmit}>
        <input
          name='title'
          value={newBanner.title}
          onChange={handleNewChange}
          placeholder='Title'
          className='p-2 border rounded'
          required
        />
        <input
          name='subtitle'
          value={newBanner.subtitle}
          onChange={handleNewChange}
          placeholder='Subtitle'
          className='p-2 border rounded'
        />
        <input
          name='image'
          value={newBanner.image}
          onChange={handleNewChange}
          placeholder='Image URL'
          className='p-2 border rounded'
        />
        <input
          name='discount'
          value={newBanner.discount}
          onChange={handleNewChange}
          placeholder='Discount'
          className='p-2 border rounded'
        />
        <input
          name='buttonText'
          value={newBanner.buttonText}
          onChange={handleNewChange}
          placeholder='Button Text'
          className='p-2 border rounded'
        />
        <button type='submit' className='p-2 bg-yellow-500 text-white rounded'>
          Add
        </button>
      </form>
      {error && <div className='text-red-500 mb-2'>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className='w-full overflow-x-auto sm:rounded-lg shadow-md'>
          <table className='min-w-[500px] w-full text-sm text-left rtl:text-right text-yellow-700 dark:text-yellow-400'>
            <thead className='text-xs uppercase bg-yellow-50 dark:bg-yellow-700 dark:text-yellow-400'>
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
                      >
                        <input
                          name='title'
                          value={editBanner.title}
                          onChange={handleEditChange}
                          className='p-2 border rounded'
                          required
                        />
                        <input
                          name='subtitle'
                          value={editBanner.subtitle}
                          onChange={handleEditChange}
                          className='p-2 border rounded'
                        />
                        <input
                          name='image'
                          value={editBanner.image}
                          onChange={handleEditChange}
                          className='p-2 border rounded'
                        />
                        <input
                          name='discount'
                          value={editBanner.discount}
                          onChange={handleEditChange}
                          className='p-2 border rounded'
                        />
                        <input
                          name='buttonText'
                          value={editBanner.buttonText}
                          onChange={handleEditChange}
                          className='p-2 border rounded'
                        />
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
                  <tr key={banner._id}>
                    <td className='px-6 py-4'>{banner.title}</td>
                    <td className='px-6 py-4'>{banner.subtitle}</td>
                    <td className='px-6 py-4'>{banner.image}</td>
                    <td className='px-6 py-4'>{banner.discount}</td>
                    <td className='px-6 py-4'>{banner.buttonText}</td>
                    <td className='px-6 py-4 flex gap-2'>
                      <button
                        className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
                        onClick={() => handleEdit(banner)}
                      >
                        Edit
                      </button>
                      <button
                        className='font-medium text-red-600 dark:text-red-500 hover:underline'
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
