import React from "react";
import { Link } from "react-router-dom";

// Old DashProfile and adminProfile removed. Only new DashProfile below.

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
    <div className='p-6 max-w-md mx-auto'>
      <h2 className='text-xl font-bold mb-4'>Admin Profile</h2>
      <div className='space-y-2'>
        <div>
          <strong>Username:</strong> {username}
        </div>
        <div>
          <strong>Email:</strong> {email}
        </div>
        <div>
          <strong>Role:</strong> admin
        </div>
        <div>
          <strong>Joined:</strong> 2024-01-01
        </div>
      </div>
      <Link
        to='/dashboard/settings'
        className='inline-block px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 font-semibold'
      >
        Go to Settings
      </Link>
    </div>
  );
}

export default DashProfile;
