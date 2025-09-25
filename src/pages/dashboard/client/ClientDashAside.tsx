import { Link, NavLink } from "react-router-dom";
import React, { useState } from "react";

function ClientDashAside() {
  const [isOpen, setIsOpen] = useState(false);

  function logout() {
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("dashboardDarkMode");
    localStorage.removeItem("email");
    sessionStorage.clear();
    window.location.href = "/";
  }

  const sidebarContent = (
    <div className='flex flex-col h-full justify-between'>
      <div>
        <h2 className='font-extrabold mb-8 text-3xl text-gray-800 dark:text-yellow-100 tracking-wide'>
          <Link
            to='/'
            className='hover:text-gray-600 dark:hover:text-yellow-300 transition-colors'
          >
            Kapee.
          </Link>
        </h2>
        <nav>
          <ul className='flex flex-col gap-2 w-full'>
            {[
              {
                label: "Dashboard",
                to: "/client-dashboard",
                icon: "🏠",
                exact: true,
              },
              { label: "Orders", to: "/client-dashboard/orders", icon: "🛒" },
              {
                label: "Wishlist",
                to: "/client-dashboard/wishlist",
                icon: "💖",
              },
              { label: "Support", to: "/client-dashboard/support", icon: "❓" },
            ].map(({ label, to, icon, exact }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={label === "Dashboard"}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-sm transition-colors",
                      isActive
                        ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-yellow-100"
                        : "text-gray-800 dark:text-yellow-100 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-yellow-300",
                    ].join(" ")
                  }
                >
                  <span>{icon}</span>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <Link
        to='/client-dashboard/settings'
        className='border-2 border-gray-300 dark:border-gray-700 p-2 mt-2 font-bold w-full text-gray-900 dark:text-yellow-100 rounded-lg shadow self-end flex items-center justify-center transition-all duration-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-yellow-300 active:scale-95 active:shadow-inner'
        style={{ marginTop: "2rem" }}
      >
        Settings
      </Link>
      <button
        className='border-2 border-gray-300 dark:border-gray-700 p-2 mt-6 font-bold w-full bg-gradient-to-r from-gray-50 dark:from-gray-800 to-gray-200 dark:to-gray-900 hover:from-gray-200 dark:hover:from-gray-700 hover:to-gray-300 dark:hover:to-gray-800 text-gray-900 dark:text-yellow-100 rounded-lg shadow transition-all duration-200 self-end flex items-center justify-center gap-2'
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
        className='md:hidden fixed top-4 left-4 z-50 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-yellow-100 rounded-full p-2 shadow-lg'
        onClick={() => setIsOpen(true)}
        aria-label='Open dashboard menu'
      >
        <span className='font-bold'>☰</span>
      </button>

      {/* Sidebar for desktop */}
      <aside className='hidden md:flex fixed top-0 left-0 flex-col p-6 h-screen bg-white dark:bg-gray-900 text-left min-w-[220px] max-w-[260px] border-r border-gray-200 dark:border-gray-700 shadow-lg z-40'>
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
          <aside className='fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 z-50 p-6 flex flex-col text-left animate-slide-in border-r border-gray-200 dark:border-gray-700 shadow-2xl'>
            <button
              className='absolute top-4 right-4 text-gray-900 dark:text-yellow-100 bg-gray-100 dark:bg-gray-800 rounded-full p-2 shadow-md'
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

export default ClientDashAside;
