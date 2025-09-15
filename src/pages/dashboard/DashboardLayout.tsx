import { Outlet } from "react-router-dom";
import DashboardNav from "./DashboardNav";
import DashboardAside from "./DashboardAside";

function DashboardLayout() {
  return (
    <div className='flex h-screen w-screen'>
      <DashboardAside />
      <div className='flex flex-col w-full'>
        <DashboardNav />
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
