import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UserCog,
  Building,
  ShieldCheck,
  CalendarCheck,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { logout } from "../../../services/auth";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { AdminSidebarItem } from "../../../types/navigation";

interface AdminSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const menuItems: AdminSidebarItem[] = [
  {
    label: "관리자 계정",
    path: "/admin/managers",
    icon: <ShieldCheck className='w-5 h-5' />,
  },
  {
    label: "튜터 관리",
    path: "/admin/tutors",
    icon: <UserCog className='w-5 h-5' />,
  },
  {
    label: "조직 관리",
    path: "/admin/organizations",
    icon: <Building className='w-5 h-5' />,
  },
  {
    label: "예약 관리",
    path: "/admin/reservations",
    icon: <CalendarCheck className='w-5 h-5' />,
  },
  {
    label: "설정 관리",
    path: "/admin/settings",
    icon: <Settings className='w-5 h-5' />,
  },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const today = format(new Date(), "yyyy년 M월 d일 EEEE", { locale: ko });
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className='flex flex-col justify-between h-full py-4 px-2'>
      {/* 상단: 토글 버튼 + 유저 인사말 */}
      <div className='space-y-6'>
        <div className='flex justify-end'>
          <button
            onClick={toggleSidebar}
            className='p-2 rounded hover:bg-gray-100 transition'
          >
            {isOpen ? (
              <ChevronLeft className='w-4 h-4 text-gray-600' />
            ) : (
              <Menu className='w-4 h-4 text-gray-600' />
            )}
          </button>
        </div>

        {/* 유저 정보 */}
        {isOpen && (
          <div className='space-y-1 px-2'>
            <p className='text-gray-500 text-xs'>{today}</p>
            <h2 className='text-base font-semibold text-gray-800'>
              {user?.name}님, 안녕하세요 👋
            </h2>
          </div>
        )}

        {/* 메뉴 */}
        <nav className='space-y-1 mt-6'>
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                isActive(item.path)
                  ? "bg-[#DBE9FE] text-blue-600"
                  : "text-gray-700 hover:bg-blue-50"
              } ${isOpen ? "justify-start" : "justify-center"}`}
            >
              {item.icon}
              {isOpen && <span className='text-sm'>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* 하단 로그아웃 */}
      <div className='pt-4 border-t border-gray-200'>
        <button
          onClick={logout}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-md transition ${
            isOpen ? "justify-start" : "justify-center"
          }`}
        >
          <LogOut className='w-4 h-4' />
          {isOpen && <span>로그아웃</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
