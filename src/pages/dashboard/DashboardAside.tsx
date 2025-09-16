import { Link } from "react-router-dom";

import React, { useState } from "react";

function DashboardAside() {
  const [isOpen, setIsOpen] = useState(false);
  // Helper to remove cookies
  function logout() {
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
  }

  // Sidebar content
  const sidebarContent = (
    <div className='flex flex-col h-full justify-between'>
      <div>
        <h2 className='font-bold mb-6 text-center cursor-pointer'>
          <Link to='/'>Kapee.</Link>
        </h2>
        <ul className='flex flex-col gap-4'>
          <li>
            <a href='/dashboard'>Home</a>
          </li>
          <li>
            <a href='/dashboard/product'>Products</a>
          </li>
          <li>
            <a href='/dashboard/customers'>Customers</a>
          </li>
        </ul>
      </div>
      <button
        className='border p-2 mt-6 font-bold w-full bg-white hover:bg-yellow-400 text-black rounded self-end'
        style={{ marginTop: "auto" }}
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <button
        className='md:hidden fixed top-4 left-4 z-50 bg-yellow-400 text-black rounded-full p-2 shadow-lg'
        onClick={() => setIsOpen(true)}
        aria-label='Open dashboard menu'
      >
        <span className='font-bold'>☰</span>
      </button>

      {/* Sidebar for desktop */}
      <aside className='hidden md:flex flex-col p-6 h-full bg-yellow-300 text-left min-w-[220px] max-w-[260px]'>
        {sidebarContent}
      </aside>

      {/* Sidebar for mobile (drawer) */}
      {isOpen && (
        <>
          <div
            className='fixed inset-0 bg-black/40 z-40'
            onClick={() => setIsOpen(false)}
            aria-label='Close dashboard menu overlay'
          />
          <aside className='fixed top-0 left-0 h-full w-64 bg-yellow-300 z-50 p-6 flex flex-col text-left animate-slide-in'>
            <button
              className='absolute top-4 right-4 text-black bg-white rounded-full p-2 shadow-md'
              onClick={() => setIsOpen(false)}
              aria-label='Close dashboard menu'
            >
              ✕
            </button>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}

export default DashboardAside;
