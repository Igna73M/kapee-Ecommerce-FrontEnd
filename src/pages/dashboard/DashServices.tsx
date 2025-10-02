import React, { useEffect, useState } from "react";
import axios from "axios";
import * as LucideIcons from "lucide-react";

function DashServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editService, setEditService] = useState({
    icon: "",
    title: "",
    description: "",
  });
  const [newService, setNewService] = useState({
    icon: "",
    title: "",
    description: "",
  });

  // Helper to get access token from localStorage or cookies
  const getToken = () => {
    const local = localStorage.getItem("accessToken");
    if (local) return local;
    const match = document.cookie.match(/accessToken=([^;]+)/);
    return match ? match[1] : "";
  };

  // Fetch services
  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://kapee-ecommerce-backend.onrender.com/api_v1/services`)
      .then((res) => {
        setServices(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch services");
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

  // Add new service (protected)
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({ ...prev, [name]: value }));
  };
  const handleNewSubmit = (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setError("You must be signed in as admin to add services.");
      return;
    }
    axios
      .post(
        `https://kapee-ecommerce-backend.onrender.com/api_v1/services`,
        newService,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setServices((prev) => [...prev, res.data]);
        setNewService({ icon: "", title: "", description: "" });
        setError("");
      })
      .catch((err) => {
        let msg = "Failed to add service";
        if (err.response && err.response.data && err.response.data.message) {
          msg += `: ${err.response.data.message}`;
        }
        setError(msg);
      });
  };

  // Edit service (protected)
  const handleEdit = (service) => {
    setEditId(service._id);
    setEditService({
      icon: service.icon,
      title: service.title,
      description: service.description,
    });
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditService((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      setError("You must be signed in as admin to update services.");
      return;
    }
    axios
      .patch(
        `https://kapee-ecommerce-backend.onrender.com/api_v1/services/${editId}`,
        editService,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setServices((prev) =>
          prev.map((s) => (s._id === editId ? res.data : s))
        );
        setEditId(null);
        setEditService({ icon: "", title: "", description: "" });
        setError("");
      })
      .catch((err) => {
        let msg = "Failed to update service";
        if (err.response && err.response.data && err.response.data.message) {
          msg += `: ${err.response.data.message}`;
        }
        setError(msg);
      });
  };

  // Delete service (protected)
  const handleDelete = (id) => {
    const token = getToken();
    if (!token) {
      setError("You must be signed in as admin to delete services.");
      return;
    }
    axios
      .delete(
        `https://kapee-ecommerce-backend.onrender.com/api_v1/services/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setServices((prev) => prev.filter((s) => s._id !== id));
        setError("");
      })
      .catch((err) => {
        let msg = "Failed to delete service";
        if (err.response && err.response.data && err.response.data.message) {
          msg += `: ${err.response.data.message}`;
        }
        setError(msg);
      });
  };

  // Helper: render Lucide icon by name, fallback to text/icon/image
  const renderIcon = (icon) => {
    if (!icon) return <span className='italic text-gray-400'>No icon</span>;
    const LucideIcon = LucideIcons[icon];
    if (LucideIcon) {
      return <LucideIcon className='w-8 h-8 text-yellow-500 inline-block' />;
    }
    if (icon.startsWith("http") || icon.startsWith("/")) {
      return (
        <img
          src={icon}
          alt='icon'
          className='w-8 h-8 object-contain inline-block'
        />
      );
    }
    return <i className={`${icon} text-xl`} aria-label={icon} />;
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
          type='text'
          name='icon'
          value={newService.icon}
          onChange={handleNewChange}
          placeholder='Lucide icon name (e.g. Truck, Package, ShoppingCart)'
          className='p-2 border rounded w-full sm:w-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
          required
        />
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
          <table className='min-w-[500px] w-full text-sm text-left rtl:text-right text-gray-800 dark:text-yellow-100'>
            <thead className='text-xs uppercase bg-gray-100 dark:bg-gray-800 dark:text-yellow-100'>
              <tr>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Icon</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Title</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Description</th>
                <th className='px-4 py-2 sm:px-6 sm:py-3'>Action</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) =>
                editId === service._id ? (
                  <tr key={service._id}>
                    <td colSpan={4} className='px-6 py-4'>
                      <form
                        className='flex gap-2 items-center'
                        onSubmit={handleEditSubmit}
                      >
                        <input
                          name='icon'
                          value={editService.icon}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          required
                          placeholder='Icon'
                        />
                        <input
                          name='title'
                          value={editService.title}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          required
                          placeholder='Title'
                        />
                        <input
                          name='description'
                          value={editService.description}
                          onChange={handleEditChange}
                          className='p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-yellow-100'
                          placeholder='Description'
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
                    <td className='px-6 py-4'>{renderIcon(service.icon)}</td>
                    <td className='px-6 py-4'>{service.title}</td>
                    <td className='px-6 py-4'>{service.description}</td>
                    <td>
                      <div className='px-6 py-4 flex gap-2'>
                        <button
                          className='flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:text-white hover:bg-blue-600 dark:hover:bg-blue-500 hover:shadow px-3 py-1 rounded transition-all duration-150'
                          onClick={() => handleEdit(service)}
                          title='Edit service'
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
                                "Are you sure you want to delete this service? This action cannot be undone."
                              )
                            ) {
                              handleDelete(service._id);
                            }
                          }}
                          title='Delete service'
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

export default DashServices;
