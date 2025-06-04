import { useNavigate, useLocation } from "react-router-dom";
import { CalendarCheck, Clock } from "lucide-react";
import { useReservations } from "../../../context/ReservationContext";
import { useAuth } from "../../../context/AuthContext";
import NotificationBox from "./NotificationBox";
import { getKSTTodayString } from "../../../utils/getKSTToday";

const TutorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservations } = useReservations();
  const { user } = useAuth();

  // 한국 시간 기준 오늘 날짜
  const todayKST = getKSTTodayString();

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
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className='py-5 px-3 text-sm space-y-5'>
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

      <div className='space-y-2'>
        <h4 className='font-semibold text-gray-700'>알림</h4>
        <NotificationBox count={todayReservations.length} />
      </div>
    </div>
  );
};

export default TutorSidebar;
