import React from "react";
import { dummyUsers } from "../../data/dummyUsers";

function DashCustomers() {
  return (
    <div className='p-6'>
      <h2 className='text-xl font-bold mb-4'>Registered Customers</h2>
      <div className='w-full overflow-x-auto sm:rounded-lg shadow-md'>
        <table className='min-w-[400px] w-full text-sm text-left rtl:text-right text-yellow-700 dark:text-yellow-400'>
          <thead className='text-xs uppercase bg-yellow-50 dark:bg-yellow-700 dark:text-yellow-400'>
            <tr>
              <th
                scope='col'
                className='px-4 py-2 sm:px-6 sm:py-3 bg-yellow-50 dark:bg-yellow-800'
              >
                Username
              </th>
              <th scope='col' className='px-4 py-2 sm:px-6 sm:py-3'>
                Email
              </th>
              <th
                scope='col'
                className='px-4 py-2 sm:px-6 sm:py-3 bg-yellow-50 dark:bg-yellow-800'
              >
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {dummyUsers.filter((u) => u.userRole !== "admin").length > 0 ? (
              dummyUsers
                .filter((u) => u.userRole !== "admin")
                .map((user, idx) => (
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
                      className='px-4 py-2 sm:px-6 sm:py-3 font-medium text-gray-900 whitespace-nowrap bg-yellow-50 dark:text-white dark:bg-yellow-800'
                    >
                      {user.username}
                    </th>
                    <td className='px-4 py-2 sm:px-6 sm:py-3'>{user.email}</td>
                    <td className='px-4 py-2 sm:px-6 sm:py-3 bg-yellow-50 dark:bg-yellow-800'>
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
    </div>
  );
}

export default DashCustomers;
