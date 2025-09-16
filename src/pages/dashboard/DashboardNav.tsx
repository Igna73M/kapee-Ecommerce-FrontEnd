function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function DashboardNav() {
  const username = getCookie("username") || "user";

  return (
    <div className='w-full md:w-[calc(100%-220px)] fixed top-0 left-0 z-30 border border-t-0 border-l-0 border-r-0 p-4 md:p-6 border-gray-200 text-gray-700 font-bold bg-white shadow md:ml-[220px] overflow-x-auto'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <p className='text-lg text-center md:text-left w-full'>
          Welcome <span className='text-yellow-600'>{username}</span>!
        </p>
        <div className='flex justify-end w-full md:w-auto'>
          <a
            href='/dashboard/profile'
            className='text-gray-600 hover:text-gray-800 underline md:ml-4'
          >
            Profile
          </a>
        </div>
      </div>
    </div>
  );
}

export default DashboardNav;
