import { Outlet } from "react-router-dom";
import DashboardNav from "./DashboardNav";
import DashboardAside from "./DashboardAside";

function DashboardLayout() {
  return (
    <div className='flex h-screen w-screen overflow-auto bg-gray-100'>
      <DashboardAside />
      <div className='flex flex-col w-full md:w-[calc(100%-220px)] relative ml-0 md:ml-[220px]'>
        <DashboardNav />
        <div className='pt-[100px] overflow-auto'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
