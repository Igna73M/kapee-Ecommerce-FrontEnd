import React from "react";
import ClientDashAside from "./ClientDashAside";
import { Outlet } from "react-router-dom";
import ClientDashNav from "./ClientDashNav";

function ClientDashboardLayout() {
  return (
    <div className='flex h-screen w-screen overflow-auto bg-gray-100 dark:bg-gray-900'>
      <ClientDashAside />
      <div className='flex flex-col w-full md:w-[calc(100%-220px)] relative ml-0 md:ml-[220px]'>
        <ClientDashNav />
        <div className='pt-[100px] overflow-auto min-h-screen max-h-[contain] bg-white dark:bg-gray-900'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ClientDashboardLayout;
