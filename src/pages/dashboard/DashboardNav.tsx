function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

import React, { useState } from "react";

function DashboardNav() {
  const username = getCookie("username") || "user";

  return (
    <div className='w-full border border-t-0 border-l-0 border-r-0 p-4 md:p-6 border-yellow-400 text-yellow-500 font-bold bg-white'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <p className='text-lg text-center md:text-left w-full'>
          Welcome <span className='text-black'>{username}</span>!
        </p>
        <a
          href='/dashboard/profile'
          className='text-yellow-600 hover:text-yellow-800 underline md:ml-4'
        >
          Profile
        </a>
      </div>
    </div>
  );
}

export default DashboardNav;
