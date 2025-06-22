import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../../components/admin/shared/AdminSidebar";
import AdminHeader from "../../components/admin/shared/AdminHeader";
import { Menu, ChevronLeft } from "lucide-react";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className='flex flex-col h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 gap-10'>
      {/* <AdminHeader  /> */}
      <div className='flex flex-1 bg-gray-50 gap-5'>
        <aside
          className={`${
            isSidebarOpen ? "w-[190px]" : "w-[56px]"
          } transition-all duration-300 border border-gray-200 bg-white rounded-xl`}
        >
          <AdminSidebar
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          />
        </aside>

        <main className='flex-1 overflow-y-auto p-6 border border-gray-200 bg-white rounded-xl'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
