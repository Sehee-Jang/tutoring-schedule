"use client";

import { useAuth } from "../../../context/AuthContext";
import { useModal } from "../../../context/ModalContext";
import { logout } from "../../../services/auth";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { LogOut } from "lucide-react";
import Button from "../../../components/shared/Button";
import { useState } from "react";
import { useToast } from "../../../hooks/use-toast";
import { resetDatabase } from "../../../services/admin/resetDatabase";

const AdminHeader = () => {
  const { showModal } = useModal();
  const { user } = useAuth();
  const { toast } = useToast();

  const today = format(new Date(), "yyyy년 M월 d일 EEEE", { locale: ko });

  const [resetting, setResetting] = useState(false);

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
    <header className='flex items-end justify-between'>
      <div>
        <h1 className='text-2xl font-bold text-gray-800'>
          {user?.name}님, 안녕하세요 👋
        </h1>
        <p className='text-sm text-gray-500 mt-1'>{today}</p>
      </div>

      <Button
        variant='warning'
        onClick={handleResetDatabase}
        disabled={resetting}
      >
        {resetting ? "리셋 중..." : "데이터베이스 리셋"}
      </Button>

      <div className='flex justify-center items-center gap-2'>
        {!user && (
          <Button onClick={() => showModal("login")} variant='outline'>
            로그인
          </Button>
        )}
        {user && (
          <Button
            variant='outline'
            size='sm'
            onClick={logout}
            className='flex items-center gap-1'
          >
            <LogOut className='w-4 h-4' />
            <span>로그아웃</span>
          </Button>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
