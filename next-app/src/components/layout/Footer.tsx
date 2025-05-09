"use client";

import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import { logout } from "@/services/auth";
import { LogOut } from "lucide-react";

const Footer = () => {
  const { user } = useAuth();
  const { showModal } = useModal();

  return (
    // <footer className='flex justify-center py-6 text-sm text-gray-600'>
    //   <div className='flex items-center gap-2'>
    //     {!user && (
    //       <>
    //         관리자이신가요?&nbsp;
    //         <button
    //           onClick={() => showModal("login")}
    //           className='underline text-blue-600 hover:text-blue-800'
    //         >
    //           관리자 로그인
    //         </button>
    //       </>
    //     )}

    //     {user && (
    //       <button
    //         onClick={logout}
    //         className='flex items-center gap-1 hover:text-black'
    //         title='로그아웃'
    //       >
    //         <LogOut className='w-4 h-4' />
    //         <span>로그아웃</span>
    //       </button>
    //     )}
    //   </div>
    // </footer>
    <footer className='text-center text-sm text-gray-500 py-6'>
      <p>© 2025 Sehee Jang. All rights reserved.</p>
      <div>
        Contact:{" "}
        <a
          href='mailto:seheejang.korea@gmail.com'
          className='underline hover:text-black'
        >
          seheejang.korea@gmail.com
        </a>
        <div className='flex justify-center items-center py-6 gap-2'>
          {!user && (
            <>
              관리자이신가요?&nbsp;
              <button
                onClick={() => showModal("login")}
                className='underline text-blue-600 hover:text-blue-800'
              >
                관리자 로그인
              </button>
            </>
          )}
          {user && (
            <button
              onClick={logout}
              className='flex items-center gap-1 hover:text-black'
              title='로그아웃'
            >
              <LogOut className='w-4 h-4' />
              <span>로그아웃</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
