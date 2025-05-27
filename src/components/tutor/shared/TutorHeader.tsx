"use client";

import { useAuth } from "../../../context/AuthContext";
import { useModal } from "../../../context/ModalContext";
import { logout } from "../../../services/auth";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { LogOut } from "lucide-react";
import Button from "../../shared/Button";

const TutorHeader = () => {
  const { showModal } = useModal();
  const { user } = useAuth();

  const today = format(new Date(), "yyyy년 M월 d일 EEEE", { locale: ko });

  return (
    <header className='flex items-end justify-between'>
      <div>
        <h1 className='text-2xl font-bold text-gray-800'>
          {user?.name ?? "튜터"}님, 안녕하세요 👋
        </h1>
        <p className='text-sm text-gray-500 mt-1'>{today}</p>
      </div>

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

export default TutorHeader;
