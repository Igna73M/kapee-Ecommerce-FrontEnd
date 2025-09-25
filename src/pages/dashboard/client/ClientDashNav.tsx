import { User } from "lucide-react";
import { Link } from "react-router-dom";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}
function ClientDashNav() {
  const username = getCookie("username") || "clientuser";

  return (
    <div className='w-full md:w-[calc(100%-220px)] fixed top-0 left-0 z-30 border border-t-0 border-l-0 border-r-0 p-4 md:p-6 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-yellow-100 font-bold bg-white dark:bg-gray-900 shadow md:ml-[220px] overflow-x-auto'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <p className='text-lg text-center md:text-left w-full'>
          Welcome{" "}
          <span className='text-yellow-600 dark:text-yellow-400'>
            {username}
          </span>
          !
        </p>
        <div className='flex justify-end w-full md:w-auto'>
          <Link
            to='/client-dashboard/profile'
            className='text-gray-600 dark:text-yellow-100 hover:underline hover:text-yellow-600 dark:hover:text-yellow-400 hover:decoration-gray-800 md:ml-4 flex flex-col items-center'
          >
            <User className='self-center' />
            Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ClientDashNav;
