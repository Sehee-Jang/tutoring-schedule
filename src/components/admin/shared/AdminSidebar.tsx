import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminSidebarItem } from "../../../types/navigation";
import {
  Users,
  Building,
  Layers,
  BookOpen,
  CalendarCheck,
  OctagonAlert,
} from "lucide-react";
import Button from "../../../components/shared/Button";
import { resetDatabase } from "../../../services/admin/resetDatabase";
import { useToast } from "../../../hooks/use-toast";

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
  const [resetting, setResetting] = useState(false);
  const { toast } = useToast();

  // 리셋 핸들러
  const handleResetDatabase = async () => {
    if (!window.confirm("⚠️ 모든 데이터베이스가 초기화됩니다. 진행할까요?"))
      return;
    setResetting(true);
    try {
      await resetDatabase();
      toast({
        title: "데이터베이스가 초기화되었습니다.",
        variant: "default",
      });
    } catch (error) {
      console.error("초기화 오류:", error);
      toast({
        title: "초기화에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setResetting(false);
    }
  };
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
      <Button
        variant='warning'
        size='sm'
        onClick={handleResetDatabase}
        disabled={resetting}
        className='w-full flex items-center font-semibold justify-evenly px-4 py-2 rounded-md'
      >
        <OctagonAlert className='w-4 h-4' />
        {resetting ? "리셋 중..." : "데이터베이스 리셋"}
      </Button>
    </div>
  );
};

export default AdminSidebar;
