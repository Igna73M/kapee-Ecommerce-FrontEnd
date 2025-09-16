import React, { useEffect, useState } from "react";
import axios from "axios";

function DashAdvert() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editSlide, setEditSlide] = useState({
    title: "",
    subtitle: "",
    image: "",
    discount: "",
    buttonText: "",
  });
  const [newSlide, setNewSlide] = useState({
    title: "",
    subtitle: "",
    image: "",
    discount: "",
    buttonText: "",
  });

  // Fetch hero slides
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api_v1/hero-slides")
      .then((res) => {
        setSlides(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch hero slides");
        setLoading(false);
      });
  }, []);

  // Add new slide
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewSlide((prev) => ({ ...prev, [name]: value }));
  };
  const handleNewSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api_v1/hero-slides", newSlide)
      .then((res) => {
        setSlides((prev) => [...prev, res.data]);
        setNewSlide({
          title: "",
          subtitle: "",
          image: "",
          discount: "",
          buttonText: "",
        });
      })
      .catch(() => setError("Failed to add hero slide"));
  };

  // Edit slide
  const handleEdit = (slide) => {
    setEditId(slide._id);
    setEditSlide({
      title: slide.title,
      subtitle: slide.subtitle,
      image: slide.image,
      discount: slide.discount,
      buttonText: slide.buttonText,
    });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditSlide((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .patch(`http://localhost:5000/api_v1/hero-slides/${editId}`, editSlide)
      .then((res) => {
        setSlides((prev) => prev.map((s) => (s._id === editId ? res.data : s)));
        setEditId(null);
        setEditSlide({
          title: "",
          subtitle: "",
          image: "",
          discount: "",
          buttonText: "",
        });
      })
      .catch(() => setError("Failed to update hero slide"));
  };

  // Delete slide
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api_v1/hero-slides/${id}`)
      .then(() => {
        setSlides((prev) => prev.filter((s) => s._id !== id));
      })
      .catch(() => setError("Failed to delete hero slide"));
  };

  return (
    <div className='p-6'>
      <h2 className='text-xl font-bold mb-4'>Advertisement (Hero Slides)</h2>
      {/* Add new slide */}
      <form className='flex gap-2 mb-6' onSubmit={handleNewSubmit}>
        <input
          name='title'
          value={newSlide.title}
          onChange={handleNewChange}
          placeholder='Title'
          className='p-2 border rounded'
          required
        />
        <input
          name='subtitle'
          value={newSlide.subtitle}
          onChange={handleNewChange}
          placeholder='Subtitle'
          className='p-2 border rounded'
        />
        <input
          name='image'
          value={newSlide.image}
          onChange={handleNewChange}
          placeholder='Image URL'
          className='p-2 border rounded'
        />
        <input
          name='discount'
          value={newSlide.discount}
          onChange={handleNewChange}
          placeholder='Discount'
          className='p-2 border rounded'
        />
        <input
          name='buttonText'
          value={newSlide.buttonText}
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
              {slides.map((slide) =>
                editId === slide._id ? (
                  <tr key={slide._id}>
                    <td colSpan={6} className='px-6 py-4'>
                      <form
                        className='flex gap-2 items-center'
                        onSubmit={handleEditSubmit}
                      >
                        <input
                          name='title'
                          value={editSlide.title}
                          onChange={handleEditChange}
                          className='p-2 border rounded'
                          required
                        />
                        <input
                          name='subtitle'
                          value={editSlide.subtitle}
                          onChange={handleEditChange}
                          className='p-2 border rounded'
                        />
                        <input
                          name='image'
                          value={editSlide.image}
                          onChange={handleEditChange}
                          className='p-2 border rounded'
                        />
                        <input
                          name='discount'
                          value={editSlide.discount}
                          onChange={handleEditChange}
                          className='p-2 border rounded'
                        />
                        <input
                          name='buttonText'
                          value={editSlide.buttonText}
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
                  <tr key={slide._id}>
                    <td className='px-6 py-4'>{slide.title}</td>
                    <td className='px-6 py-4'>{slide.subtitle}</td>
                    <td className='px-6 py-4'>{slide.image}</td>
                    <td className='px-6 py-4'>{slide.discount}</td>
                    <td className='px-6 py-4'>{slide.buttonText}</td>
                    <td className='px-6 py-4 flex gap-2'>
                      <button
                        className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
                        onClick={() => handleEdit(slide)}
                      >
                        Edit
                      </button>
                      <button
                        className='font-medium text-red-600 dark:text-red-500 hover:underline'
                        onClick={() => handleDelete(slide._id)}
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

export default DashAdvert;
