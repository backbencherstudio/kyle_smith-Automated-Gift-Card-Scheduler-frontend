"use client";
import React, { useState } from "react";

import CustomToastContainer from "@/components/CustomToast/CustomToastContainer";
import Header from "@/components/common/Header";
import Sidebar from "../_component/common/Sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="w-full h-screen overflow-hidden relative">
      {/* Fixed container for layout */}
      <div className="relative  flex h-full">
        {/* Sidebar */}
        <div
          className={`
            fixed top-0 left-1/2 -translate-x-1/2 xl:translate-x-0
            h-screen w-[300px] z-30 bg-white
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-[0%]" : "-translate-x-[150%]"}
            xl:static xl:translate-x-0
          `}
          style={{ left: "0px" }}
        >
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-20"
            onClick={closeSidebar}
          />
        )}

        {/* Main Content Layout */}
        <div className="flex flex-col h-full w-full">
          {/* Header */}
          <div  className="w-full sticky top-0 left-0 z-10">
            <Header onMenuClick={openSidebar} sidebarOpen={sidebarOpen} />
          </div>

          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto bg-[#FAFAFC] p-4 lg:pl-6 lg:pt-6">
            <h2 className='lg:text-2xl text-lg md:text-xl font-bold text-black mb-4 lg:mb-6'>Dashboard</h2>
            {children}
            <CustomToastContainer />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
