import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/shared/AdminSidebar";
import AdminHeader from "../../components/admin/shared/AdminHeader";

const AdminLayout = () => {
  return (
    <div className='flex flex-col h-screen bg-gray-50 px-8 py-6 gap-10'>
      <AdminHeader />
      <div className='flex flex-1 bg-gray-50 gap-5'>
        <aside className='w-[190px] border border-gray-200 bg-white rounded-xl'>
          <AdminSidebar />
        </aside>
        <main className='flex-1 overflow-y-auto p-6 border border-gray-200 bg-white rounded-xl'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
