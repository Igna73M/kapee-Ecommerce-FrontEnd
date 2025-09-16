import React, { useState } from "react";

function DashSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className='max-w-md mx-auto mt-12 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center'>
      <h2 className='text-2xl font-bold mb-2 text-black'>Admin Settings</h2>
      <p className='text-black mb-6 text-center'>
        Customize your dashboard experience and notifications.
      </p>
      <div className='w-full space-y-6'>
        <label className='flex items-center justify-between bg-yellow-50 rounded-lg px-4 py-3 shadow-sm'>
          <span className='font-semibold text-black'>Email Notifications</span>
          <input
            type='checkbox'
            checked={emailNotifications}
            onChange={() => setEmailNotifications((v) => !v)}
            className='form-checkbox h-5 w-5 text-yellow-500 accent-yellow-500'
          />
        </label>
        <label className='flex items-center justify-between bg-yellow-50 rounded-lg px-4 py-3 shadow-sm'>
          <span className='font-semibold text-black'>Dark Mode</span>
          <input
            type='checkbox'
            checked={darkMode}
            onChange={() => setDarkMode((v) => !v)}
            className='form-checkbox h-5 w-5 text-yellow-500 accent-yellow-500'
          />
        </label>
        <div className='flex justify-center'>
          <button className='mt-4 px-6 py-2 bg-yellow-500 text-white rounded-lg font-semibold shadow hover:bg-yellow-600 active:scale-95 transition-transform duration-100'>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashSettings;
