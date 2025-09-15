import React, { useState } from "react";

function DashSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div className='p-6 max-w-md mx-auto'>
      <h2 className='text-xl font-bold mb-4'>Admin Settings</h2>
      <div className='space-y-4'>
        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={emailNotifications}
            onChange={() => setEmailNotifications((v) => !v)}
          />
          Email Notifications
        </label>
        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={darkMode}
            onChange={() => setDarkMode((v) => !v)}
          />
          Dark Mode
        </label>
        <button className='mt-4 px-4 py-2 bg-yellow-400 text-black rounded'>
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default DashSettings;
