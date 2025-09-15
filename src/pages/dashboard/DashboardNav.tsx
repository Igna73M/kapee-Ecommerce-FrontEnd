function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function DashboardNav() {
  const username = getCookie("username") || "user";
  return (
    <div className='flex w-full border p-6 border-yellow-400 text-yellow-500 font-bold justify-between'>
      <ul className='flex w-full justify-between'>
        <p>
          Welcome <span className='text-black'>{username}</span>!
        </p>
        <li>
          <form>
            <input
              type='text'
              placeholder='Search...'
              className='p-2 border border-yellow-400 rounded-l'
            />
            <button
              type='submit'
              className='bg-yellow-400 text-white p-2 rounded-r'
            >
              Search
            </button>
          </form>
        </li>
        <li>
          <a href='/dashboard/profile'>Profile</a>
        </li>
      </ul>
    </div>
  );
}

export default DashboardNav;
