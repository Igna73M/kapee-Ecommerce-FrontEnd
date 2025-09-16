function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

import React, { useState } from "react";

const dummyProducts = [
  { id: "1", name: "Smartphone", category: "Electronics" },
  { id: "2", name: "Headphones", category: "Electronics" },
  { id: "3", name: "Watch", category: "Accessories" },
  { id: "4", name: "Shoes", category: "Fashion" },
];
const dummyUsers = [
  { id: "u1", username: "john_doe", email: "john@example.com" },
  { id: "u2", username: "jane_smith", email: "jane@example.com" },
  { id: "u3", username: "adminuser", email: "admin@kapee.com" },
];

function DashboardNav() {
  const username = getCookie("username") || "user";
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState("products");

  function handleSearch(e) {
    e.preventDefault();
    let results = [];
    if (searchType === "products") {
      results = dummyProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      results = dummyUsers.filter(
        (u) =>
          u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setSearchResults(results);
  }

  return (
    <div className='w-full border p-4 md:p-6 border-yellow-400 text-yellow-500 font-bold bg-white'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <p className='text-lg text-center md:text-left w-full'>
          Welcome <span className='text-black'>{username}</span>!
        </p>
        {/* <form className='flex w-full md:w-auto' onSubmit={handleSearch}>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className='p-2 border border-yellow-400 rounded-l bg-white text-black'
          >
            <option value='products'>Products</option>
            <option value='users'>Users</option>
          </select>
          <input
            type='text'
            placeholder={`Search ${searchType}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='p-2 border border-yellow-400 w-full md:w-auto'
          />
          <button
            type='submit'
            className='bg-yellow-400 text-white p-2 rounded-r'
          >
            Search
          </button>
        </form> */}
        <a
          href='/dashboard/profile'
          className='text-yellow-600 hover:text-yellow-800 underline md:ml-4'
        >
          Profile
        </a>
      </div>
      {/* Search Results */}
      {searchTerm && (
        <div className='mt-2 bg-yellow-50 border border-yellow-200 rounded p-2 text-black'>
          {searchResults.length === 0 ? (
            <div>No results found.</div>
          ) : (
            <ul className='space-y-1'>
              {searchType === "products"
                ? searchResults.map((p) => (
                    <li key={p.id}>
                      <span className='font-bold'>{p.name}</span>{" "}
                      <span className='text-xs text-gray-500'>
                        ({p.category})
                      </span>
                    </li>
                  ))
                : searchResults.map((u) => (
                    <li key={u.id}>
                      <span className='font-bold'>{u.username}</span>{" "}
                      <span className='text-xs text-gray-500'>({u.email})</span>
                    </li>
                  ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default DashboardNav;
