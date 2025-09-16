import { Link, NavLink } from "react-router-dom";

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
        <h2 className='font-extrabold mb-8 text-3xl text-yellow-900 tracking-wide'>
          <Link to='/' className='hover:text-yellow-600 transition-colors'>
            Kapee.
          </Link>
        </h2>
        <nav>
          <ul className='flex flex-col gap-2 w-full'>
            {[
              { label: "Dashboard", to: "/dashboard", icon: "🏠", exact: true },
              { label: "Products", to: "/dashboard/product", icon: "📦" },
              { label: "Customers", to: "/dashboard/customers", icon: "👥" },
              { label: "Categories", to: "/dashboard/brands", icon: "🗂️" },
              { label: "Services", to: "/dashboard/services", icon: "🛠️" },
              {
                label: "Advertise",
                to: "/dashboard/advertisement",
                icon: "📢",
              },
              { label: "Banners", to: "/dashboard/banners", icon: "🖼️" },
              { label: "Blogs", to: "/dashboard/blog", icon: "📝" },
            ].map(({ label, to, icon, exact }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={label === "Dashboard"} // Only Dashboard uses 'end' for exact match
                  className={({ isActive }) => {
                    if (label === "Dashboard") {
                      return [
                        "flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-sm transition-colors",
                        isActive
                          ? "bg-yellow-400 text-black"
                          : "text-yellow-900",
                      ].join(" ");
                    }
                    return [
                      "flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-sm transition-colors",
                      isActive
                        ? "bg-yellow-400 text-black"
                        : "text-yellow-900 hover:bg-yellow-400 hover:text-black",
                    ].join(" ");
                  }}
                >
                  <span>{icon}</span>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
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
