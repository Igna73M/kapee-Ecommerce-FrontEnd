import React, { useEffect, useState } from "react";
import axios from "axios";

function DashServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editService, setEditService] = useState({
    title: "",
    description: "",
  });
  const [newService, setNewService] = useState({ title: "", description: "" });

  // Fetch services
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api_v1/services")
      .then((res) => {
        setServices(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch services");
        setLoading(false);
      });
  }, []);

  // Add new service
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
  };
  const handleNewSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api_v1/services", newService)
      .then((res) => {
        setServices((prev) => [...prev, res.data]);
        setNewService({ title: "", description: "" });
      })
      .catch(() => setError("Failed to add service"));
  };

  // Edit service
  const handleEdit = (service) => {
    setEditId(service._id);
    setEditService({ title: service.title, description: service.description });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditService((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .patch(`http://localhost:5000/api_v1/services/${editId}`, editService)
      .then((res) => {
        setServices((prev) =>
          prev.map((s) => (s._id === editId ? res.data : s))
        );
        setEditId(null);
        setEditService({ title: "", description: "" });
      })
      .catch(() => setError("Failed to update service"));
  };

  // Delete service
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api_v1/services/${id}`)
      .then(() => {
        setServices((prev) => prev.filter((s) => s._id !== id));
      })
      .catch(() => setError("Failed to delete service"));
  };

  return (
    <div className='p-6 bg-white dark:bg-gray-900 min-h-screen'>
      <h2 className='text-xl font-bold mb-4 text-gray-900 dark:text-yellow-100'>
        Services
      </h2>
      {/* Add new service */}
      <form
        className='flex flex-col sm:flex-row gap-2 mb-6 w-full sm:flex-wrap'
        onSubmit={handleNewSubmit}
      >
        <input
          name='title'
          value={newService.title}
          onChange={handleNewChange}
          placeholder='Title'
          className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
          required
        />
        <input
          name='description'
          value={newService.description}
          onChange={handleNewChange}
          placeholder='Description'
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
          <table className='min-w-[400px] w-full text-sm text-left rtl:text-right text-gray-800 dark:text-yellow-100'>
            <thead className='text-xs uppercase bg-gray-100 dark:bg-gray-800 dark:text-yellow-100'>
              <tr>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Title</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Description</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Action</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) =>
                editId === service._id ? (
                  <tr key={service._id}>
                    <td colSpan={3} className='px-6 py-4'>
                      <form
                        className='flex gap-2 items-center'
                        onSubmit={handleEditSubmit}
                      >
                        <input
                          name='title'
                          value={editService.title}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          required
                        />
                        <input
                          name='description'
                          value={editService.description}
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
                  <tr key={service._id}>
                    <td className='px-6 py-4'>{service.title}</td>
                    <td className='px-6 py-4'>{service.description}</td>
                    <td className='px-6 py-4 flex gap-2'>
                      <button
                        className='font-medium text-blue-600 dark:text-blue-400 hover:underline'
                        onClick={() => handleEdit(service)}
                      >
                        Edit
                      </button>
                      <button
                        className='font-medium text-red-600 dark:text-red-400 hover:underline'
                        onClick={() => handleDelete(service._id)}
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

export default DashServices;
