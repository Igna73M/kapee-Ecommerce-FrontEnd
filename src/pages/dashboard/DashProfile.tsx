import React, { useEffect } from "react";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function DashProfile() {
  const username = getCookie("username") || "adminuser";
  const email = getCookie("email") || "admin@kapee.com";

  // Ensure dark mode is applied on mount if enabled
  useEffect(() => {
    const darkMode = localStorage.getItem("dashboardDarkMode") === "true";
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  return (
    <div className='max-w-md mx-auto mt-12 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col items-center'>
      <div className='w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-4'>
        <span className='text-4xl font-bold text-gray-500 dark:text-yellow-100'>
          {username[0]?.toUpperCase() || "A"}
        </span>
      </div>
      <h2 className='text-2xl font-bold mb-2 text-gray-800 dark:text-yellow-100'>
        Admin Profile
      </h2>
      <p className='text-gray-500 dark:text-yellow-100 mb-6 text-center'>
        Manage your account information
      </p>
      <div className='w-full space-y-4'>
        <div className='flex justify-between'>
          <span className='font-semibold text-gray-700 dark:text-yellow-100'>
            Username:
          </span>
          <span className='text-gray-900 dark:text-yellow-100'>{username}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-semibold text-gray-700 dark:text-yellow-100'>
            Email:
          </span>
          <span className='text-gray-900 dark:text-yellow-100'>{email}</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-semibold text-gray-700 dark:text-yellow-100'>
            Role:
          </span>
          <span className='text-gray-900 dark:text-yellow-100'>admin</span>
        </div>
        <div className='flex justify-between'>
          <span className='font-semibold text-gray-700 dark:text-yellow-100'>
            Joined:
          </span>
          <span className='text-gray-900 dark:text-yellow-100'>2024-01-01</span>
        </div>
      </div>
    </div>
  );
}

export default DashProfile;
