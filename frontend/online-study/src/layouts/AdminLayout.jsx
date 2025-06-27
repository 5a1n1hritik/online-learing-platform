import Header from "@/components/admin/Header";
import Sidebar from "@/components/admin/Sidebar";
import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 md:ml-64 peer-data-[collapsed=true]:md:ml-16">
        <Header />
        <main className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6 w-full min-w-0">
          <div className="max-w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
