import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminSidebarItem } from "../../../types/navigation";
import { Users, Building, Layers, BookOpen, CalendarCheck } from "lucide-react";

const menuItems: AdminSidebarItem[] = [
  {
    label: "튜터 관리",
    path: "/admin/tutors",
    icon: <Users className='w-4 h-4' />,
  },
  {
    label: "조직 관리",
    path: "/admin/organizations",
    icon: <Building className='w-4 h-4' />,
  },
  {
    label: "트랙 관리",
    path: "/admin/tracks",
    icon: <Layers className='w-4 h-4' />,
  },
  {
    label: "기수 관리",
    path: "/admin/batches",
    icon: <BookOpen className='w-4 h-4' />,
  },
  {
    label: "예약 관리",
    path: "/admin/reservations",
    icon: <CalendarCheck className='w-4 h-4' />,
  },
];

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className='py-5 px-3 text-sm space-y-5'>
      {/* 메뉴 섹션 */}
      <nav className='space-y-4 border-b border-gray-200 pb-5'>
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-[166px] flex items-center font-semibold justify-evenly px-4 py-2 rounded-md ${
              isActive(item.path)
                ? "bg-[#DBE9FE] text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
