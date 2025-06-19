import { useNavigate, useLocation } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  UserRoundPen,
  Menu,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { useReservations } from "../../../context/ReservationContext";
import { useAuth } from "../../../context/AuthContext";
import { logout } from "../../../services/auth";
import NotificationBox from "./NotificationBox";
import { getKSTTodayString } from "../../../utils/getKSTToday";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface TutorSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const TutorSidebar: React.FC<TutorSidebarProps> = ({
  isOpen,
  toggleSidebar,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservations } = useReservations();
  const { user } = useAuth();

  // 한국 시간 기준 오늘 날짜
  const todayKST = getKSTTodayString();
  const today = format(new Date(), "yyyy년 M월 d일 EEEE", { locale: ko });

  const todayReservations = reservations.filter(
    (r) => r.tutor === user?.name && r.classDate === todayKST
  );

  const menuItems = [
    {
      label: "실시간 예약 확인",
      path: "/tutor/reservations",
      icon: <CalendarCheck className='w-4 h-4' />,
    },
    {
      label: "튜터링 시간 설정",
      path: "/tutor/time-settings",
      icon: <Clock className='w-4 h-4' />,
    },
    {
      label: "개인 프로필 설정",
      path: "/tutor/profile-settings",
      icon: <UserRoundPen className='w-4 h-4' />,
    },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className='flex flex-col justify-between h-full py-4 px-2 text-sm'>
      {/* 상단: 토글 + 유저 정보 + 메뉴 + 오늘의 예약 */}
      <div className='space-y-6'>
        {/* 토글 버튼 */}
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

        {/* 유저 인사 */}
        {isOpen && (
          <div className='space-y-1 px-2'>
            <p className='text-gray-500 text-xs'>{today}</p>
            <h2 className='text-base font-semibold text-gray-800'>
              {user?.name}님, 안녕하세요
            </h2>
          </div>
        )}

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

        {/* 오늘 예약 */}
        {isOpen && (
          <div className='mt-4 px-2'>
            <NotificationBox count={todayReservations.length} isCompact />
          </div>
        )}

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
    </div>
  );
};

export default TutorSidebar;
