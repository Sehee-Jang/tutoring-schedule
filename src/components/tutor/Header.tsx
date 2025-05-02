"use client";

import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import { logout } from "../../services/auth";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import PrimaryButton from "../../components/shared/PrimaryButton";
import { LogOut } from "lucide-react";

const Header = () => {
  const { showModal } = useModal();
  const { user, isAdmin, isTutor } = useAuth();

  const today = format(new Date(), "yyyy년 M월 d일 EEEE", { locale: ko });

  return (
    <header className='flex items-center justify-between px-6 py-4 border-b bg-white shadow-sm'>
      <div>
        <h1 className='text-lg font-semibold'>
          {user?.name ?? "튜터"}님, 안녕하세요 👋
        </h1>
        <p className='text-sm text-gray-500'>{today}</p>
      </div>

      <div className='flex justify-center items-center gap-2'>
        {!user && (
          <button
            onClick={() => showModal("login")}
            className='underline text-blue-600 hover:text-blue-800'
          >
            로그인
          </button>
        )}
        {user && (
          <PrimaryButton
            onClick={logout}
            className='flex items-center gap-1 hover:text-black'
          >
            <LogOut className='w-4 h-4' />
            <span>로그아웃</span>
          </PrimaryButton>
        )}
      </div>
    </header>
  );
};

export default Header;
