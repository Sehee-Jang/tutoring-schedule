import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminSidebarItem } from "../../../types/navigation";
import {
  UserCog,
  Building,
  ShieldCheck,
  CalendarCheck,
  Settings,
} from "lucide-react";

const menuItems: AdminSidebarItem[] = [
  {
    label: "관리자 계정",
    path: "/admin/managers",
    icon: <ShieldCheck className='w-4 h-4' />,
  },
  {
    label: "튜터 관리",
    path: "/admin/tutors",
    icon: <UserCog className='w-4 h-4' />,
  },
  {
    label: "조직 관리",
    path: "/admin/organizations",
    icon: <Building className='w-4 h-4' />,
  },
  {
    label: "예약 관리",
    path: "/admin/reservations",
    icon: <CalendarCheck className='w-4 h-4' />,
  },
  {
    label: "설정 관리",
    path: "/admin/settings",
    icon: <Settings className='w-4 h-4' />,
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
            className={`w-[166px] flex items-center gap-2 font-medium px-8 py-2 rounded-md text-left ${
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
