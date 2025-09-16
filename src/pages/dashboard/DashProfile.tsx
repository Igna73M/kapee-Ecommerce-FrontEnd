import React from "react";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function DashProfile() {
  const username = getCookie("username") || "adminuser";
  const email = getCookie("email") || "admin@kapee.com";
  // You can add more fields if you store them in cookies during login

  return (
    <div className='max-w-md mx-auto mt-12 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center'>
      <div className='w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-4'>
        <span className='text-4xl font-bold text-gray-500'>
          {username[0]?.toUpperCase() || "A"}
        </span>
      </div>
      <h2 className='text-2xl font-bold mb-2 text-gray-800'>Admin Profile</h2>
      <p className='text-gray-500 mb-6 text-center'>
        Manage your account information
      </p>
      <div className='w-full space-y-4'>
        <div className='flex justify-between'>
          <span className='font-semibold text-gray-700'>Username:</span>
          <span className='text-gray-900'>{username}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-semibold text-gray-700'>Email:</span>
          <span className='text-gray-900'>{email}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-semibold text-gray-700'>Role:</span>
          <span className='text-gray-900'>admin</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-semibold text-gray-700'>Joined:</span>
          <span className='text-gray-900'>2024-01-01</span>
        </div>
      </div>
    </div>
  );
}

export default DashProfile;
