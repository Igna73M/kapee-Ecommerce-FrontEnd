import React, { useState } from "react";
import { useEffect } from "react";

function DashSettings() {
  // Read initial dark mode from localStorage
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("dashboardDarkMode") === "true"
  );

  useEffect(() => {
    const darkMode = localStorage.getItem("dashboardDarkMode") === "true";
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  // Save settings handler
  const handleSave = () => {
    localStorage.setItem("dashboardDarkMode", darkMode ? "true" : "false");
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    // You can add more logic for email notifications here if needed
  };

  return (
    <div className='max-w-md mx-auto mt-12 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col items-center'>
      <h2 className='text-2xl font-bold mb-2 text-black dark:text-yellow-100'>
        Admin Settings
      </h2>
      <p className='text-black dark:text-yellow-100 mb-6 text-center'>
        Customize your dashboard experience and notifications.
      </p>
      <div className='w-full space-y-6'>
        <label className='flex items-center justify-between bg-yellow-50 dark:bg-gray-800 rounded-lg px-4 py-3 shadow-sm'>
          <span className='font-semibold text-black dark:text-yellow-100'>
            Email Notifications
          </span>
          <input
            type='checkbox'
            checked={emailNotifications}
            onChange={() => setEmailNotifications((v) => !v)}
            className='form-checkbox h-5 w-5 text-yellow-500 accent-yellow-500 dark:accent-yellow-400'
          />
        </label>
        <label className='flex items-center justify-between bg-yellow-50 dark:bg-gray-800 rounded-lg px-4 py-3 shadow-sm'>
          <span className='font-semibold text-black dark:text-yellow-100'>
            Dark Mode
          </span>
          <input
            type='checkbox'
            checked={darkMode}
            onChange={() => setDarkMode((v) => !v)}
            className='form-checkbox h-5 w-5 text-yellow-500 accent-yellow-500 dark:accent-yellow-400'
          />
        </label>
        <div className='flex justify-center'>
          <button
            className='mt-4 px-6 py-2 bg-yellow-500 text-white rounded-lg font-semibold shadow hover:bg-yellow-600 dark:hover:bg-yellow-400 active:scale-95 transition-transform duration-100'
            onClick={handleSave}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashSettings;
