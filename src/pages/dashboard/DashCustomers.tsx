import React, { useEffect, useState } from "react";
import axios from "axios";

type User = {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  userRole: string;
};

function DashCustomers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api_v1/user/users")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.users || [];
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch users");
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

  const customers = users.filter((u) => u.userRole !== "admin");

  return (
    <div className='p-6 bg-white dark:bg-gray-900 min-h-screen'>
      <h2 className='text-xl font-bold mb-4 text-gray-900 dark:text-yellow-100'>
        Registered Customers
      </h2>
      {error && <div className='text-red-500 mb-2'>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className='w-full overflow-x-auto sm:rounded-lg shadow-md'>
          <table className='min-w-[400px] w-full text-sm text-left rtl:text-right text-gray-800 dark:text-yellow-100'>
            <thead className='text-xs uppercase bg-gray-100 dark:bg-gray-800 dark:text-yellow-100'>
              <tr>
                <th
                  scope='col'
                  className='px-4 py-2 sm:px-6 sm:py-3 bg-gray-100 dark:bg-gray-800'
                >
                  Username
                </th>
                <th
                  scope='col'
                  className='px-4 py-2 sm:px-6 sm:py-3 bg-white dark:bg-gray-800'
                >
                  Email
                </th>
                <th
                  scope='col'
                  className='px-4 py-2 sm:px-6 sm:py-3 bg-gray-100 dark:bg-gray-800'
                >
                  Joined
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map((user, idx) => (
                  <tr
                    key={user._id}
                    className={
                      "border-b border-gray-200 dark:border-gray-700" +
                      (idx % 2 === 0
                        ? " bg-white dark:bg-gray-900"
                        : " bg-gray-50 dark:bg-gray-800")
                    }
                  >
                    <th
                      scope='row'
                      className='px-4 py-2 sm:px-6 sm:py-3 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-yellow-100 dark:bg-gray-800'
                    >
                      {user.username}
                    </th>
                    <td className='px-4 py-2 sm:px-6 sm:py-3'>{user.email}</td>
                    <td className='px-4 py-2 sm:px-6 sm:py-3 bg-gray-50 dark:bg-gray-800'>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className='px-6 py-4 text-center'>
                    No users available. Please check back later.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashCustomers;
