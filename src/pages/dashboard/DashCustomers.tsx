import React from "react";

const dummyUsers = [
  {
    id: "u1",
    username: "john_doe",
    email: "john@example.com",
    joined: "2024-02-10",
  },
  {
    id: "u2",
    username: "jane_smith",
    email: "jane@example.com",
    joined: "2024-03-15",
  },
  {
    id: "u3",
    username: "adminuser",
    email: "admin@kapee.com",
    joined: "2024-01-01",
  },
];

function DashCustomers() {
  return (
    <div className='p-6'>
      <h2 className='text-xl font-bold mb-4'>Registered Users</h2>
      <table className='min-w-full border'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='p-2 border'>Username</th>
            <th className='p-2 border'>Email</th>
            <th className='p-2 border'>Joined</th>
          </tr>
        </thead>
        <tbody>
          {dummyUsers.map((user) => (
            <tr key={user.id}>
              <td className='p-2 border'>{user.username}</td>
              <td className='p-2 border'>{user.email}</td>
              <td className='p-2 border'>{user.joined}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DashCustomers;
