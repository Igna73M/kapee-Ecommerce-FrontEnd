import { Link } from "react-router-dom";

function DashboardAside() {
  // Helper to remove cookies
  function logout() {
    document.cookie =
      "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
  }
  return (
    <div className='p-6 h-full bg-yellow-300 text-left flex flex-col justify-between'>
      <div>
        <h2 className='font-bold mb-6 text-center cursor-pointer'>
          <Link to='/'>Kapee.</Link>
        </h2>
        <ul className='flex flex-col justify-evenly'>
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
}

export default DashboardAside;
